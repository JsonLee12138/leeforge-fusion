import { describe, test, expect } from "vitest";
import {
  authMiddleware,
  loggerMiddleware,
  errorMiddleware,
  corsMiddleware,
  composeMiddleware,
  type Context,
} from "../../../src/middleware/hono";

describe("Middleware", () => {
  test("authMiddleware rejects without token", async () => {
    const ctx: Context = {
      req: { headers: {}, method: "GET", path: "/test" },
      res: { status: 200, headers: {}, body: null },
      set: (key, value) => {
        ctx[key] = value;
      },
    };

    await authMiddleware(ctx, async () => {});

    expect(ctx.res.status).toBe(401);
    expect(ctx.res.body).toEqual({ error: "Unauthorized" });
  });

  test("authMiddleware accepts valid token", async () => {
    const ctx: Context = {
      req: {
        headers: { authorization: "Bearer test-token" },
        method: "GET",
        path: "/test",
      },
      res: { status: 200, headers: {}, body: null },
      set: (key, value) => {
        ctx[key] = value;
      },
    };

    let nextCalled = false;
    await authMiddleware(ctx, async () => {
      nextCalled = true;
    });

    expect(ctx.user).toBeDefined();
    expect(ctx.user?.id).toBe("user-123");
    expect(nextCalled).toBe(true);
  });

  test("corsMiddleware sets headers", async () => {
    const ctx: Context = {
      req: { headers: {}, method: "GET", path: "/test" },
      res: { status: 200, headers: {}, body: null },
      set: (key, value) => {
        ctx[key] = value;
      },
    };

    await corsMiddleware(ctx, async () => {});

    expect(ctx.res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(ctx.res.headers["Access-Control-Allow-Methods"]).toBeDefined();
  });

  test("corsMiddleware handles OPTIONS", async () => {
    const ctx: Context = {
      req: { headers: {}, method: "OPTIONS", path: "/test" },
      res: { status: 200, headers: {}, body: null },
      set: (key, value) => {
        ctx[key] = value;
      },
    };

    await corsMiddleware(ctx, async () => {});

    expect(ctx.res.status).toBe(204);
  });

  test("errorMiddleware catches errors", async () => {
    const ctx: Context = {
      req: { headers: {}, method: "GET", path: "/test" },
      res: { status: 200, headers: {}, body: null },
      set: (key, value) => {
        ctx[key] = value;
      },
    };

    const errorMiddlewareWithThrow = async (
      ctx: Context,
      next: () => Promise<void>,
    ) => {
      throw new Error("Test error");
    };

    await errorMiddleware(ctx, async () => {
      await errorMiddlewareWithThrow(ctx, async () => {});
    });

    expect(ctx.res.status).toBe(500);
    expect(ctx.res.body).toEqual({ error: "Internal server error" });
  });

  test("loggerMiddleware logs correctly", async () => {
    const ctx: Context = {
      req: { headers: {}, method: "GET", path: "/test" },
      res: { status: 200, headers: {}, body: null },
      set: (key, value) => {
        ctx[key] = value;
      },
    };

    let logged = false;
    const originalLog = console.log;
    console.log = () => {
      logged = true;
    };

    await loggerMiddleware(ctx, async () => {});

    console.log = originalLog;
    expect(logged).toBe(true);
  });

  test("composeMiddleware combines multiple middleware", async () => {
    const middleware1 = async (ctx: Context, next: () => Promise<void>) => {
      ctx.res.headers["X-First"] = "1";
      await next();
    };

    const middleware2 = async (ctx: Context, next: () => Promise<void>) => {
      ctx.res.headers["X-Second"] = "2";
      await next();
    };

    const ctx: Context = {
      req: { headers: {}, method: "GET", path: "/test" },
      res: { status: 200, headers: {}, body: null },
      set: (key, value) => {
        ctx[key] = value;
      },
    };

    const composed = composeMiddleware([middleware1, middleware2]);
    await composed(ctx, async () => {
      ctx.res.body = { done: true };
    });

    expect(ctx.res.headers["X-First"]).toBe("1");
    expect(ctx.res.headers["X-Second"]).toBe("2");
    expect(ctx.res.body).toEqual({ done: true });
  });
});
