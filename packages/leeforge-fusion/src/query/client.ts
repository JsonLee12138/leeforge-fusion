import { QueryClient } from "@tanstack/solid-query";

export function createQueryClient(options?: {
  ssr?: boolean;
  staleTime?: number;
  gcTime?: number;
}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        enabled: options?.ssr ?? true,
        staleTime: options?.staleTime ?? 1000 * 60 * 5,
        gcTime: options?.gcTime ?? 1000 * 60 * 10,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 2,
      },
    },
  });
}

export function hydrateQueryClient(client: QueryClient, state: any): void {
  if (state && typeof state === "object" && state.queries) {
    state.queries.forEach((query: any) => {
      client.setQueryData(query.queryKey, query.state.data);
    });
  }
}
