import type { QueryClient } from "@tanstack/solid-query";

export interface RouteLoaderContext {
  queryClient: QueryClient;
  user?: any;
  API_BASE: string;
  params: Record<string, string>;
  request: Request;
}

export type Loader<T = any> = (context: RouteLoaderContext) => Promise<T> | T;

export type LoaderResult<T extends Loader> =
  T extends Loader<infer R> ? R : never;
