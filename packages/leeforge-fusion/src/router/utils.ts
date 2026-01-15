import { Route } from "./types";

export function formatRoutePath(path: string): string {
  return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

export function isDynamicRoute(path: string): boolean {
  return path.includes(":");
}

export function getRouteDepth(route: Route): number {
  return route.path.split("/").filter(Boolean).length;
}

export function findRouteByPath(
  routes: Route[],
  path: string,
): Route | undefined {
  for (const route of routes) {
    if (route.path === path) return route;
    if (route.children) {
      const found = findRouteByPath(route.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

export function flattenRoutes(routes: Route[]): Route[] {
  const result: Route[] = [];
  const traverse = (routeList: Route[]) => {
    for (const route of routeList) {
      result.push(route);
      if (route.children) {
        traverse(route.children);
      }
    }
  };
  traverse(routes);
  return result;
}
