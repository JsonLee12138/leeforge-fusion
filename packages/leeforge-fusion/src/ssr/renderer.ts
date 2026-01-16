import { QueryClient, dehydrate } from "@tanstack/solid-query";
import { generateHTML } from "./template";
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
  private queryClient: QueryClient;

  constructor(options: { queryClient: QueryClient }) {
    this.queryClient = options.queryClient;
  }

  async render(options: SSRRenderOptions): Promise<SSRResult> {
    const start = Date.now();

    try {
      const appHtml = `
        <div id="app">
          <h1>Leeforge Fusion SSR</h1>
          <p>URL: ${options.url}</p>
          <p>User: ${options.context.user?.name || "Anonymous"}</p>
          <p>API Base: ${options.context.API_BASE}</p>
        </div>
      `;

      const dehydratedState = dehydrate(this.queryClient);

      const routerState = {
        location: {
          pathname: new URL(options.url, "http://localhost").pathname,
          search: "",
          hash: "",
        },
        matches: [],
      };

      const finalHtml = generateHTML({
        appHtml,
        dehydratedState,
        routerState,
        user: options.context.user,
        apiBase: options.context.API_BASE,
      });

      return {
        html: finalHtml,
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
