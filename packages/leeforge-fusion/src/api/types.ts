export type HTTPMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export interface APIRoute {
  path: string;
  file: string;
  methods: HTTPMethod[];
}

export interface APIRouteConfig {
  apiDir: string;
  ignore?: string[];
}
