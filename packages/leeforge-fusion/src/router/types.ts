export type RouteType = "page" | "layout" | "api" | "server";

export interface Route {
  path: string;
  file: string;
  type: RouteType;
  params: string[];
  children?: Route[];
  componentName?: string;
  importName?: string;
}

export interface ScannerConfig {
  appDir: string;
  ignore?: string[];
  cache?: boolean;
}

export interface ScanResult {
  routes: Route[];
  fileMap: Map<string, Route>;
  conflicts: Array<{
    route: Route;
    reason: string;
  }>;
}

export type RouteConflict =
  | "duplicate_path"
  | "ambiguous_dynamic"
  | "invalid_nesting";

export interface RouteValidationError {
  route: Route;
  conflict: RouteConflict;
  message: string;
}
