import { hydrate } from "solid-js/web";
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/solid-router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

export function hydrateApp() {
  const dehydratedState = (window as any).__DEHYDRATED_STATE__;
  const user = (window as any).__USER__;
  const API_BASE = (window as any).__API_BASE__ || "/api";
  const routeTree = (window as any).__ROUTE_TREE__;

  const queryClient = new QueryClient();

  if (dehydratedState && dehydratedState.queries) {
    dehydratedState.queries.forEach((query: any) => {
      queryClient.setQueryData(query.queryKey, query.state.data);
    });
  }

  const router = createRouter({
    history: createMemoryHistory({
      initialEntries: [window.location.pathname],
    }),
    routeTree: routeTree,
    context: {
      queryClient,
      user,
      API_BASE,
    },
  });

  hydrate(() => {
    return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router as any} />
      </QueryClientProvider>
    );
  }, document.getElementById("root")!);
}
