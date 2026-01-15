import { Route } from "./types";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

export interface GeneratorConfig {
  outputDir: string;
}

export class RouteGenerator {
  private outputDir: string;

  constructor(config: GeneratorConfig) {
    this.outputDir = config.outputDir;
  }

  async generate(routes: Route[]): Promise<{
    clientRoutes: string[];
    manifest: any;
  }> {
    const clientRoutes = await this.generateClientRoutes(routes);
    const manifest = this.generateManifest(routes);
    await this.generateClientEntry(routes);

    return { clientRoutes, manifest };
  }

  private async generateClientRoutes(routes: Route[]): Promise<string[]> {
    const generatedFiles: string[] = [];
    const traverse = async (routeList: Route[]) => {
      for (const route of routeList) {
        if (route.type === "page" || route.type === "server") {
          const content = this.generateClientRouteFile(route);
          const filePath = this.getOutputFilePath(route);

          this.ensureDirectory(filePath);
          writeFileSync(filePath, content);
          generatedFiles.push(filePath);
        }

        if (route.children) {
          await traverse(route.children);
        }
      }
    };

    await traverse(routes);
    return generatedFiles;
  }

  private generateClientRouteFile(route: Route): string {
    const routePath = route.path.replace(/:([^/]+)/g, "$$$1");
    const finalPath = routePath === "/" ? "/$" : routePath;

    return `import { createFileRoute } from '@tanstack/solid-router'
import { queryClient } from '../query-client'

export const Route = createFileRoute('${finalPath}')({
  loader: async ({ params, context }) => {
    return { data: null }
  },
  
  component: ${route.componentName}
})

function ${route.componentName}() {
  const { data } = Route.useLoaderData()
  return <div>${route.path}</div>
}
`;
  }

  private generateManifest(routes: Route[]): any {
    const manifest: any = {
      routes: [],
      timestamp: Date.now(),
    };

    const traverse = (routeList: Route[]) => {
      for (const route of routeList) {
        manifest.routes.push({
          path: route.path,
          file: route.file,
          type: route.type,
          params: route.params,
        });

        if (route.children) {
          traverse(route.children);
        }
      }
    };

    traverse(routes);
    return manifest;
  }

  private async generateClientEntry(routes: Route[]): Promise<void> {
    const imports = routes
      .filter((r) => r.type === "page" || r.type === "server")
      .map(
        (r) =>
          `import { Route as ${r.importName} } from './${r.file.replace(/\.tsx?$/, "")}'`,
      )
      .join("\n");

    const routeTree = this.generateRouteTree(routes);

    const content = `import { createRouter, createMemoryHistory } from '@tanstack/solid-router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'

${imports}

const routeTree = ${routeTree}

export const router = createRouter({
  history: createMemoryHistory(),
  routeTree,
  context: {
    queryClient: new QueryClient(),
    API_BASE: import.meta.env.VITE_API_BASE || '/api'
  }
})
`;

    const filePath = join(this.outputDir, "client-entry.ts");
    this.ensureDirectory(filePath);
    writeFileSync(filePath, content);
  }

  private generateRouteTree(routes: Route[]): string {
    if (routes.length === 0) return "null";

    const parts = routes.map((route) => {
      if (route.children && route.children.length > 0) {
        return `{
          ...${route.importName},
          children: ${this.generateRouteTree(route.children)}
        }`;
      }
      return route.importName;
    });

    return parts.join(",\n  ");
  }

  private getOutputFilePath(route: Route): string {
    const relativePath = route.file.replace(/\.tsx?$/, ".ts");
    return join(this.outputDir, relativePath);
  }

  private ensureDirectory(filePath: string): void {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}
