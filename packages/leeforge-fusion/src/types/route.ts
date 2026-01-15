import type { QueryClient } from "@tanstack/solid-query";

export interface RouteContext {
  queryClient: QueryClient;
  user?: any;
  API_BASE: string;
  params: Record<string, string>;
  request: Request;
}
