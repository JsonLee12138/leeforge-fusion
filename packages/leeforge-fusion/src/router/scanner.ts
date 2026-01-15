import { glob } from "glob";
import { relative, normalize } from "path";
import { Route, RouteType, ScannerConfig, ScanResult } from "./types";

export class RouteScanner {
  private appDir: string;
  private ignore: string[];
  private cache: boolean;
  private cacheMap: Map<string, Route[]> = new Map();

  constructor(config: ScannerConfig) {
    this.appDir = normalize(config.appDir);
    this.ignore = config.ignore || [];
    this.cache = config.cache ?? true;
  }

  async scan(): Promise<ScanResult> {
    const cacheKey = this.appDir + JSON.stringify(this.ignore);
    if (this.cache && this.cacheMap.has(cacheKey)) {
      return {
        routes: this.cacheMap.get(cacheKey)!,
        fileMap: new Map(),
        conflicts: [],
      };
    }

    const files = await this.findFiles();
    const routes = this.buildRouteTree(files);
    const validation = this.validateRoutes(routes);

    if (this.cache) {
      this.cacheMap.set(cacheKey, routes);
    }

    return {
      routes,
      fileMap: this.buildFileMap(routes),
      conflicts: validation.conflicts,
    };
  }

  private async findFiles(): Promise<string[]> {
    const pattern = `${this.appDir}/**/{page,layout,route,page.server}.{tsx,ts,jsx,js}`;
    const files = await glob(pattern, {
      ignore: this.ignore,
      nodir: true,
    });
    return files.map((f: string) => normalize(f));
  }

  private buildRouteTree(files: string[]): Route[] {
    const allRoutes: Route[] = [];

    for (const file of files) {
      const route = this.fileToRoute(file);
      if (route) {
        allRoutes.push(route);
      }
    }

    allRoutes.sort((a, b) => {
      const depthA = a.path.split("/").filter(Boolean).length;
      const depthB = b.path.split("/").filter(Boolean).length;
      if (depthA !== depthB) return depthA - depthB;
      return a.path.localeCompare(b.path);
    });

    const root: Route[] = [];
    const pathMap = new Map<string, Route>();

    for (const route of allRoutes) {
      const routePath = route.path;
      const pathParts = routePath.split("/").filter(Boolean);

      if (pathParts.length === 0) {
        root.push(route);
        pathMap.set(routePath, route);
        continue;
      }

      let parent: Route | undefined;
      for (let i = pathParts.length - 1; i > 0; i--) {
        const parentPath = "/" + pathParts.slice(0, i).join("/");
        parent = pathMap.get(parentPath);
        if (parent) break;
      }

      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(route);
      } else {
        root.push(route);
      }

      pathMap.set(routePath, route);
    }

    return root;
  }

  private fileToRoute(file: string): Route | null {
    const relativePath = relative(this.appDir, file);
    const parts = relativePath.split(/[\\/]/);
    const fileName = parts.pop()!;
    const baseName = fileName.split(".")[0];

    let type: RouteType;
    if (baseName === "page") type = "page";
    else if (baseName === "page.server") type = "server";
    else if (baseName === "layout") type = "layout";
    else if (baseName === "route") type = "api";
    else return null;

    const dirPath = parts.join("/");
    const path = this.dirToPath(dirPath, baseName);
    const params = this.extractParams(path);
    const componentName = this.toComponentName(relativePath);
    const importName = this.toImportName(relativePath);

    return {
      path,
      file: relativePath,
      type,
      params,
      componentName,
      importName,
    };
  }

  private dirToPath(dirPath: string, baseName: string): string {
    if (baseName === "page" && dirPath === "") return "/";

    const parts = dirPath.split(/[\\/]/).filter((p) => p);

    const pathParts: string[] = [];
    for (const part of parts) {
      if (part.startsWith("(") && part.endsWith(")")) {
        const groupName = part.slice(1, -1);
        if (groupName) {
          pathParts.push(groupName);
        }
        continue;
      }

      if (part.startsWith("[") && part.endsWith("]")) {
        pathParts.push(":" + part.slice(1, -1));
        continue;
      }

      pathParts.push(part);
    }

    if (baseName === "page") {
      return pathParts.length > 0 ? "/" + pathParts.join("/") : "/";
    }

    return pathParts.length > 0 ? "/" + pathParts.join("/") : "/";
  }

  private extractParams(path: string): string[] {
    const matches = path.match(/:([^/]+)/g);
    return matches ? matches.map((m) => m.slice(1)) : [];
  }

  private toComponentName(filePath: string): string {
    const parts = filePath.split(/[\\/]/);
    const name = parts
      .map((p) => {
        const cleaned = p.replace(/[^a-zA-Z0-9]/g, "");
        if (p.startsWith("[") && p.endsWith("]")) {
          return p.slice(1, -1);
        }
        if (p.startsWith("(") && p.endsWith(")")) {
          return p.slice(1, -1);
        }
        return cleaned;
      })
      .filter(Boolean)
      .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join("");
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private toImportName(filePath: string): string {
    const parts = filePath.split(/[\\/]/);
    return parts
      .map((p) => p.replace(/[^a-zA-Z0-9]/g, "_"))
      .filter(Boolean)
      .join("_");
  }

  private sortRoutes(routes: Route[]): Route[] {
    return routes
      .sort((a, b) => {
        if (a.path < b.path) return -1;
        if (a.path > b.path) return 1;
        return 0;
      })
      .map((route) => ({
        ...route,
        children: route.children ? this.sortRoutes(route.children) : undefined,
      }));
  }

  private validateRoutes(routes: Route[]): {
    conflicts: Array<{ route: Route; reason: string }>;
  } {
    const conflicts: Array<{ route: Route; reason: string }> = [];
    const pathMap = new Map<string, Route>();

    const checkConflicts = (routeList: Route[]) => {
      for (const route of routeList) {
        if (pathMap.has(route.path)) {
          conflicts.push({
            route,
            reason: `Duplicate path: ${route.path}`,
          });
        } else {
          pathMap.set(route.path, route);
        }

        if (route.children) {
          checkConflicts(route.children);
        }
      }
    };

    checkConflicts(routes);
    return { conflicts };
  }

  private buildFileMap(routes: Route[]): Map<string, Route> {
    const map = new Map<string, Route>();
    const traverse = (routeList: Route[]) => {
      for (const route of routeList) {
        map.set(route.file, route);
        if (route.children) {
          traverse(route.children);
        }
      }
    };
    traverse(routes);
    return map;
  }
}
