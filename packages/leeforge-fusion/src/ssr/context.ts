import { QueryClient } from "@tanstack/solid-query";

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface AppContext {
  request: Request;
  user?: User;
  API_BASE: string;
  queryClient: QueryClient;
  [key: string]: any;
}

export interface ContextOptions {
  request: Request;
  user?: User;
  API_BASE?: string;
}

export class ContextManager {
  static createContext(options: ContextOptions): AppContext {
    return {
      request: options.request,
      user: options.user,
      API_BASE: options.API_BASE || "/api",
      queryClient: new QueryClient(),
    };
  }

  static fromHonoContext(c: any): AppContext {
    const request = c.req.raw;
    const user = c.get("user");
    const API_BASE = c.get("API_BASE") || "/api";

    return this.createContext({
      request,
      user,
      API_BASE,
    });
  }

  static extend(
    context: AppContext,
    extensions: Record<string, any>,
  ): AppContext {
    return {
      ...context,
      ...extensions,
    };
  }
}

export { ContextManager as SSRContextManager };
