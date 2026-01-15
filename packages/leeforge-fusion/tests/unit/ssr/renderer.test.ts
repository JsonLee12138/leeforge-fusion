import { describe, test, expect, beforeAll } from "vitest";
import { SSRRenderer } from "../../../src/ssr/renderer";
import { ContextManager } from "../../../src/ssr/context";
import { QueryClient } from "@tanstack/solid-query";

describe("SSRRenderer", () => {
  let queryClient: QueryClient;

  beforeAll(() => {
    queryClient = new QueryClient();
  });

  test("creates renderer with routes and queryClient", () => {
    const mockRoutes = {
      id: "root",
      path: "/",
      component: () => ({ default: () => "Home" }),
    };

    const renderer = new SSRRenderer({
      routes: mockRoutes as any,
      queryClient,
    });

    expect(renderer).toBeDefined();
  });

  test("context manager creates context", () => {
    const context = ContextManager.createContext({
      request: new Request("http://localhost"),
      user: { id: "123", name: "Test" },
      API_BASE: "/api",
    });

    expect(context.request).toBeDefined();
    expect(context.user?.name).toBe("Test");
    expect(context.API_BASE).toBe("/api");
    expect(context.queryClient).toBeDefined();
  });

  test("context manager extends context", () => {
    const base = ContextManager.createContext({
      request: new Request("http://localhost"),
      API_BASE: "/api",
    });

    const extended = ContextManager.extend(base, { custom: "value" });

    expect(extended.custom).toBe("value");
    expect(extended.API_BASE).toBe("/api");
  });

  test("context manager converts from Hono context", () => {
    const mockHonoContext = {
      req: { raw: new Request("http://localhost") },
      get: (key: string) => {
        if (key === "user") return { id: "456" };
        if (key === "API_BASE") return "/api";
        return undefined;
      },
    };

    const context = ContextManager.fromHonoContext(mockHonoContext);

    expect(context.user?.id).toBe("456");
    expect(context.API_BASE).toBe("/api");
  });
});
