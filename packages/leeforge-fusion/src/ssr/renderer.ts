import { renderToStringAsync } from "solid-js/web";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/solid-router";
import { QueryClient, dehydrate } from "@tanstack/solid-query";
import { generateHTML } from "./template";
import type { AnyRoute } from "@tanstack/router-core";
import type { AppContext } from "./context";

export interface SSRRenderOptions {
  url: string;
  context: AppContext;
  template?: string;
}

export interface SSRResult {
  html: string;
  dehydratedState: any;
  routerState: any;
  status: number;
  headers: Record<string, string>;
}

export class SSRError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public originalError?: any,
  ) {
    super(message);
    this.name = "SSRError";
  }
}

export class SSRRenderer {
  private routes: AnyRoute;
  private queryClient: QueryClient;

  constructor(options: { routes: AnyRoute; queryClient: QueryClient }) {
    this.routes = options.routes;
    this.queryClient = options.queryClient;
  }

  async render(options: SSRRenderOptions): Promise<SSRResult> {
    const start = Date.now();

    try {
      const history = createMemoryHistory({ initialEntries: [options.url] });

      const router = createRouter({
        history,
        routeTree: this.routes as any,
        context: {
          queryClient: this.queryClient,
          user: options.context.user,
          API_BASE: options.context.API_BASE,
        },
      });

      await router.load();

      const appHtml = await renderToStringAsync(() =>
        RouterProvider({ router: router as any }),
      );

      const dehydratedState = dehydrate(this.queryClient);
      const routerState = router.state;

      const html = generateHTML({
        appHtml,
        dehydratedState,
        routerState,
        user: options.context.user,
        apiBase: options.context.API_BASE,
      });

      return {
        html,
        dehydratedState,
        routerState,
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Render-Time": `${Date.now() - start}ms`,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): SSRResult {
    console.error("SSR Error:", error);

    if (error?.name === "RedirectError") {
      return {
        html: "",
        dehydratedState: {},
        routerState: {},
        status: error.status || 302,
        headers: {
          Location: error.location || "/",
        },
      };
    }

    if (error?.status === 404 || error?.message?.includes("not found")) {
      return {
        html: `
          <div class="error">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        `,
        dehydratedState: {},
        routerState: {},
        status: 404,
        headers: { "Content-Type": "text/html" },
      };
    }

    return {
      html: `
        <div class="error">
          <h1>500 - Server Error</h1>
          <p>${error.message || "Internal Server Error"}</p>
        </div>
      `,
      dehydratedState: {},
      routerState: {},
      status: 500,
      headers: { "Content-Type": "text/html" },
    };
  }
}
