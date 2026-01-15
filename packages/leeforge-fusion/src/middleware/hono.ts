export interface AuthUser {
  id: string;
  [key: string]: any;
}

export interface Context {
  req: {
    headers: Record<string, string | undefined>;
    method: string;
    path: string;
  };
  res: {
    status: number;
    headers: Record<string, string>;
    body: any;
  };
  user?: AuthUser;
  set: (key: string, value: any) => void;
}

export type Middleware = (
  ctx: Context,
  next: () => Promise<void>,
) => Promise<void>;

export const authMiddleware: Middleware = async (ctx, next) => {
  const token = ctx.req.headers["authorization"];

  if (!token) {
    ctx.res.status = 401;
    ctx.res.body = { error: "Unauthorized" };
    return;
  }

  try {
    const user = await verifyToken(token);
    ctx.user = user;
    await next();
  } catch (error) {
    ctx.res.status = 401;
    ctx.res.body = { error: "Invalid token" };
  }
};

export const loggerMiddleware: Middleware = async (ctx, next) => {
  const start = Date.now();
  const path = ctx.req.path;

  await next();

  const duration = Date.now() - start;
  console.log(`${ctx.req.method} ${path} - ${ctx.res.status} (${duration}ms)`);
};

export const errorMiddleware: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);
    ctx.res.status = 500;
    ctx.res.body = { error: "Internal server error" };
  }
};

export const corsMiddleware: Middleware = async (ctx, next) => {
  ctx.res.headers["Access-Control-Allow-Origin"] = "*";
  ctx.res.headers["Access-Control-Allow-Methods"] =
    "GET, POST, PUT, DELETE, OPTIONS";
  ctx.res.headers["Access-Control-Allow-Headers"] =
    "Content-Type, Authorization";

  if (ctx.req.method === "OPTIONS") {
    ctx.res.status = 204;
    ctx.res.body = {};
    return;
  }

  await next();
};

async function verifyToken(token: string): Promise<AuthUser> {
  const parts = token.split(" ");
  if (parts[0] !== "Bearer") {
    throw new Error("Invalid token format");
  }

  return { id: "user-123", name: "Test User" };
}

export function composeMiddleware(middleware: Middleware[]): Middleware {
  return async (ctx, next) => {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;

      if (i < middleware.length) {
        await middleware[i](ctx, () => dispatch(i + 1));
      } else {
        await next();
      }
    };

    await dispatch(0);
  };
}
