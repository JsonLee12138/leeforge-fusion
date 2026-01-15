import { createMiddleware } from "hono/factory";
import type { Context, Next } from "hono";

export const apiLoggerMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    console.log(`[API] ${c.req.method} ${c.req.path} - ${duration}ms`);
  },
);

export const apiErrorMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    try {
      await next();
    } catch (error: any) {
      console.error(`[API Error] ${c.req.method} ${c.req.path}:`, error);

      const status = error.status || 500;
      const message = error.message || "Internal Server Error";

      return c.json(
        {
          error: message,
          status,
          path: c.req.path,
        },
        status,
      );
    }
  },
);

export const apiCorsMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    await next();

    c.res.headers.set("Access-Control-Allow-Origin", "*");
    c.res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    c.res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );

    if (c.req.method === "OPTIONS") {
      return c.body(null, 204);
    }
  },
);
