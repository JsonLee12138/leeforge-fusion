# API Reference

> Complete API documentation for Leeforge Fusion.

## Core Exports

### `startDevServer(options)`

Start the development server.

**Type:**

```typescript
async function startDevServer(options: {
  port: number;
  appDir: string;
  apiDir?: string;
  rootDir?: string;
}): Promise<{ server: any; vite: any; app: any }>;
```

**Parameters:**

- `port` - Port to listen on
- `appDir` - Path to app directory (default: "src/app")
- `apiDir` - Path to API directory (default: "src/app/api")
- `rootDir` - Root directory (default: process.cwd())

**Returns:**

- `server` - HTTP server instance
- `vite` - Vite server instance
- `app` - Hono app instance

**Example:**

```typescript
import { startDevServer } from "@leeforge/fusion";

await startDevServer({
  port: 3000,
  appDir: "src/app",
  rootDir: process.cwd(),
});
```

### `RouteScanner`

Scan routes from directory.

**Type:**

```typescript
class RouteScanner {
  constructor(config: { appDir: string; ignore?: string[]; cache?: boolean });

  scan(): Promise<{
    routes: Route[];
    fileMap: Map<string, string>;
    conflicts: Conflict[];
  }>;
}
```

**Example:**

```typescript
import { RouteScanner } from "@leeforge/fusion";

const scanner = new RouteScanner({ appDir: "src/app" });
const result = await scanner.scan();

console.log(result.routes); // Array of routes
```

### `RouteGenerator`

Generate route files.

**Type:**

```typescript
class RouteGenerator {
  constructor(config: { outputDir: string });

  generate(routes: Route[]): Promise<{
    clientRoutes: string[];
    manifest: any;
  }>;
}
```

**Example:**

```typescript
import { RouteGenerator } from "@leeforge/fusion";

const generator = new RouteGenerator({ outputDir: ".generated" });
await generator.generate(routes);
```

### `createMiddleware`

Create middleware.

**Type:**

```typescript
function createMiddleware(
  fn: (ctx: any, next: () => Promise<void>) => Promise<any>,
): any;
```

**Example:**

```typescript
import { createMiddleware } from "@leeforge/fusion/middleware";

export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await validateToken(token);
  ctx.set("user", user);

  await next();
});
```

### `createServerData`

Create server-side data loader.

**Type:**

```typescript
function createServerData<T>(
  loader: (ctx: {
    params: Record<string, string>;
    queryClient: QueryClient;
    context: any;
  }) => Promise<T>,
): () => T;
```

**Example:**

```typescript
import { createServerData } from "@leeforge/fusion/data";

export default function BlogPost() {
  const post = createServerData(async ({ params }) => {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    return res.json();
  });

  return <div>{post().title}</div>;
}
```

### `useServerAction`

Use server action on client.

**Type:**

```typescript
function useServerAction<T extends (...args: any[]) => any>(
  action: T,
): [
  (...args: Parameters<T>) => Promise<ReturnType<T> | null>,
  { loading: boolean; error: Error | null },
];
```

**Example:**

```typescript
import { useServerAction } from "@leeforge/fusion/client";

export async function createPost(data: { title: string; content: string }) {
  return { id: Date.now(), ...data };
}

export default function NewPost() {
  const [create, { loading, error }] = useServerAction(createPost);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const result = await create({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    });

    if (result) {
      alert("Post created!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>
      {error && <div class="error">{error.message}</div>}
    </form>
  );
}
```

### `defineConfig`

Define framework configuration.

**Type:**

```typescript
function defineConfig(config: {
  guards?: Record<string, string>;
  api?: {
    prefix?: string;
    timeout?: number;
  };
  ssr?: {
    render?: "stream" | "static";
    timeout?: number;
  };
  vite?: {
    server?: {
      port?: number;
      host?: string;
      https?: boolean;
      proxy?: Record<string, any>;
    };
    build?: {
      outDir?: string;
      sourcemap?: boolean;
      target?: string | string[];
      rollupOptions?: {
        input?: Record<string, string>;
        external?: (string | RegExp)[];
      };
    };
    [key: string]: any;
  };
}): any;
```

**Example:**

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  guards: {
    "/dashboard/*": "./src/middleware/auth.ts",
    "/admin/*": "./src/middleware/auth.ts",
  },
  api: {
    prefix: "/api",
    timeout: 5000,
  },
  ssr: {
    render: "stream",
    timeout: 10000,
  },
  vite: {
    server: {
      port: 3000,
      host: "localhost",
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  },
});
```

### `leeforgePlugin`

Vite plugin for Leeforge Fusion.

**Type:**

```typescript
function leeforgePlugin(): any;
```

**Example:**

```typescript
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { leeforgePlugin } from "@leeforge/fusion/vite-plugin";

export default defineConfig({
  plugins: [solid(), leeforgePlugin()],
});
```

### `APIScanner`

Scan API routes.

**Type:**

```typescript
class APIScanner {
  constructor(apiDir: string);

  scan(): Promise<APIRoute[]>;
}
```

**Example:**

```typescript
import { APIScanner } from "@leeforge/fusion/api";

const scanner = new APIScanner("src/app/api");
const routes = await scanner.scan();
```

### `APIRegistry`

Register and manage API routes.

**Type:**

```typescript
class APIRegistry {
  constructor();

  register(routes: APIRoute[]): Promise<void>;

  getApp(): any; // Returns Hono app
}
```

**Example:**

```typescript
import { APIScanner, APIRegistry } from "@leeforge/fusion/api";

const scanner = new APIScanner("src/app/api");
const routes = await scanner.scan();

const registry = new APIRegistry();
await registry.register(routes);

// Use in Hono app
app.route("/api", registry.getApp());
```

### `QueryClient`

TanStack Query client.

**Type:**

```typescript
class QueryClient {
  constructor(options?: {
    defaultOptions?: {
      queries?: {
        enabled?: boolean;
        staleTime?: number;
        gcTime?: number;
      };
    };
  });
}
```

**Example:**

```typescript
import { QueryClient } from "@tanstack/solid-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});
```

### `SSRRenderer`

Server-side renderer.

**Type:**

```typescript
class SSRRenderer {
  constructor(options: { routes: AnyRoute; queryClient: QueryClient });

  render(options: {
    url: string;
    context: AppContext;
    template?: string;
  }): Promise<{
    html: string;
    dehydratedState: any;
    routerState: any;
    status: number;
    headers: Record<string, string>;
  }>;
}
```

**Example:**

```typescript
import { SSRRenderer } from "@leeforge/fusion/ssr";

const renderer = new SSRRenderer({
  routes: routeTree,
  queryClient,
});

const result = await renderer.render({
  url: "/blog/1",
  context: { user: null, API_BASE: "/api" },
});
```

### `ContextManager`

Manage request context.

**Type:**

```typescript
class ContextManager {
  static createContext(options: {
    request: Request;
    API_BASE: string;
    user?: any;
  }): AppContext;
}
```

**Example:**

```typescript
import { ContextManager } from "@leeforge/fusion/ssr";

const context = ContextManager.createContext({
  request: req,
  API_BASE: "/api",
  user: null,
});
```

## Middleware Functions

### `requireAuth`

Require authentication.

**Type:**

```typescript
const requireAuth: Middleware;
```

**Example:**

```typescript
import { requireAuth } from "@leeforge/fusion/middleware";

export const guards = {
  "/dashboard/*": [requireAuth()],
};
```

### `requireAdmin`

Require admin role.

**Type:**

```typescript
const requireAdmin: Middleware;
```

**Example:**

```typescript
import { requireAuth, requireAdmin } from "@leeforge/fusion/middleware";

export const guards = {
  "/admin/*": [requireAuth(), requireAdmin()],
};
```

### `requireGuest`

Require not authenticated.

**Type:**

```typescript
const requireGuest: Middleware;
```

**Example:**

```typescript
import { requireGuest } from "@leeforge/fusion/middleware";

export const guards = {
  "/login/*": [requireGuest()],
};
```

### `loggerMiddleware`

Log requests.

**Type:**

```typescript
const loggerMiddleware: Middleware;
```

**Example:**

```typescript
import { loggerMiddleware } from "@leeforge/fusion/middleware";

export const guards = {
  "/*": [loggerMiddleware()],
};
```

### `errorMiddleware`

Handle errors.

**Type:**

```typescript
const errorMiddleware: Middleware;
```

**Example:**

```typescript
import { errorMiddleware } from "@leeforge/fusion/middleware";

export const guards = {
  "/*": [errorMiddleware()],
};
```

### `corsMiddleware`

Enable CORS.

**Type:**

```typescript
const corsMiddleware: Middleware;
```

**Example:**

```typescript
import { corsMiddleware } from "@leeforge/fusion/middleware";

export const guards = {
  "/api/*": [corsMiddleware()],
};
```

## API Middleware

### `apiLoggerMiddleware`

Log API requests.

**Type:**

```typescript
const apiLoggerMiddleware: Middleware;
```

**Example:**

```typescript
import { apiLoggerMiddleware } from "@leeforge/fusion/api";

export const guards = {
  "/api/*": [apiLoggerMiddleware()],
};
```

### `apiErrorMiddleware`

Handle API errors.

**Type:**

```typescript
const apiErrorMiddleware: Middleware;
```

**Example:**

```typescript
import { apiErrorMiddleware } from "@leeforge/fusion/api";

export const guards = {
  "/api/*": [apiErrorMiddleware()],
};
```

### `apiCorsMiddleware`

Enable CORS for API.

**Type:**

```typescript
const apiCorsMiddleware: Middleware;
```

**Example:**

```typescript
import { apiCorsMiddleware } from "@leeforge/fusion/api";

export const guards = {
  "/api/*": [apiCorsMiddleware()],
};
```

## Utility Functions

### `flattenRoutes`

Flatten route tree.

**Type:**

```typescript
function flattenRoutes(routes: Route[]): Route[];
```

**Example:**

```typescript
import { flattenRoutes } from "@leeforge/fusion/router";

const flatRoutes = flattenRoutes(routes);
```

### `formatRoutePath`

Format route path.

**Type:**

```typescript
function formatRoutePath(path: string): string;
```

**Example:**

```typescript
import { formatRoutePath } from "@leeforge/fusion/router";

const formatted = formatRoutePath("/blog/[id]"); // "/blog/:id"
```

### `isDynamicRoute`

Check if route is dynamic.

**Type:**

```typescript
function isDynamicRoute(path: string): boolean;
```

**Example:**

```typescript
import { isDynamicRoute } from "@leeforge/fusion/router";

isDynamicRoute("/blog/[id]"); // true
isDynamicRoute("/about"); // false
```

### `findRouteByPath`

Find route by path.

**Type:**

```typescript
function findRouteByPath(routes: Route[], path: string): Route | undefined;
```

**Example:**

```typescript
import { findRouteByPath } from "@leeforge/fusion/router";

const route = findRouteByPath(routes, "/blog/1");
```

### `validateRouteConfig`

Validate route configuration.

**Type:**

```typescript
function validateRouteConfig(config: any): {
  valid: boolean;
  errors: string[];
  conflicts: Conflict[];
};
```

**Example:**

```typescript
import { validateRouteConfig } from "@leeforge/fusion/config";

const result = validateRouteConfig(config);
if (!result.valid) {
  console.error(result.errors);
}
```

### `mergeRouteConfig`

Merge route configurations.

**Type:**

```typescript
function mergeRouteConfig(base: any, override: any): any;
```

**Example:**

```typescript
import { mergeRouteConfig } from "@leeforge/fusion/config";

const merged = mergeRouteConfig(baseConfig, overrideConfig);
```

### `generateTSConfig`

Generate TypeScript config.

**Type:**

```typescript
function generateTSConfig(options: { rootDir: string; outDir: string }): string;
```

**Example:**

```typescript
import { generateTSConfig } from "@leeforge/fusion/config";

const config = generateTSConfig({
  rootDir: process.cwd(),
  outDir: "dist",
});
```

### `writeTSConfigFile`

Write TypeScript config file.

**Type:**

```typescript
function writeTSConfigFile(config: string, path: string): Promise<void>;
```

**Example:**

```typescript
import { writeTSConfigFile } from "@leeforge/fusion/config";

await writeTSConfigFile(config, "tsconfig.json");
```

### `getAuthHeaders`

Get authentication headers.

**Type:**

```typescript
function getAuthHeaders(ctx: any): Record<string, string>;
```

**Example:**

```typescript
import { getAuthHeaders } from "@leeforge/fusion/middleware";

const headers = getAuthHeaders(ctx);
```

### `getRedirectLocation`

Get redirect location.

**Type:**

```typescript
function getRedirectLocation(error: any): string | undefined;
```

**Example:**

```typescript
import { getRedirectLocation } from "@leeforge/fusion/middleware";

const location = getRedirectLocation(error);
```

### `getRedirectStatus`

Get redirect status code.

**Type:**

```typescript
function getRedirectStatus(error: any): number;
```

**Example:**

```typescript
import { getRedirectStatus } from "@leeforge/fusion/middleware";

const status = getRedirectStatus(error);
```

### `isRedirectError`

Check if error is redirect.

**Type:**

```typescript
function isRedirectError(error: any): boolean;
```

**Example:**

```typescript
import { isRedirectError } from "@leeforge/fusion/middleware";

if (isRedirectError(error)) {
  // Handle redirect
}
```

### `isServerAction`

Check if function is server action.

**Type:**

```typescript
function isServerAction(fn: any): boolean;
```

**Example:**

```typescript
import { isServerAction } from "@leeforge/fusion/server-actions";

if (isServerAction(myFunction)) {
  // It's a server action
}
```

### `createAction`

Create server action.

**Type:**

```typescript
function createAction<T extends (...args: any[]) => any>(fn: T): T;
```

**Example:**

```typescript
import { createAction } from "@leeforge/fusion/server-actions";

export const createPost = createAction(async (data) => {
  return { id: Date.now(), ...data };
});
```

### `createGuardChain`

Create guard chain.

**Type:**

```typescript
function createGuardChain(...guards: Middleware[]): Middleware;
```

**Example:**

```typescript
import { createGuardChain } from "@leeforge/fusion/middleware";

export const requireAuthAndAdmin = createGuardChain(
  requireAuth(),
  requireAdmin(),
);
```

### `defineGuard`

Define guard.

**Type:**

```typescript
function defineGuard(name: string, fn: Middleware): Middleware;
```

**Example:**

```typescript
import { defineGuard } from "@leeforge/fusion/middleware";

export const requireAuth = defineGuard("requireAuth", async (ctx, next) => {
  // Guard logic
  await next();
});
```

### `hydrateQueryClient`

Hydrate query client on client.

**Type:**

```typescript
function hydrateQueryClient(dehydratedState: any): QueryClient;
```

**Example:**

```typescript
import { hydrateQueryClient } from "@leeforge/fusion/query";

const queryClient = hydrateQueryClient(window.__DEHYDRATED_STATE__);
```

### `createQueryClient`

Create query client.

**Type:**

```typescript
function createQueryClient(options?: {
  ssr?: boolean;
  staleTime?: number;
  gcTime?: number;
}): QueryClient;
```

**Example:**

```typescript
import { createQueryClient } from "@leeforge/fusion/query";

const queryClient = createQueryClient({
  ssr: true,
  staleTime: 1000 * 60 * 5,
});
```

## Types

### `Route`

```typescript
interface Route {
  path: string;
  file: string;
  type: "page" | "server" | "layout" | "error" | "loading";
  componentName: string;
  importName: string;
  params: string[];
  children?: Route[];
}
```

### `APIRoute`

```typescript
interface APIRoute {
  path: string;
  file: string;
  methods: string[];
  params: string[];
}
```

### `Conflict`

```typescript
interface Conflict {
  type: "duplicate" | "ambiguous";
  routes: string[];
  message: string;
}
```

### `AppContext`

```typescript
interface AppContext {
  request: Request;
  API_BASE: string;
  user?: any;
  get(key: string): any;
  set(key: string, value: any): void;
}
```

### `Middleware`

```typescript
type Middleware = (ctx: any, next: () => Promise<void>) => Promise<any>;
```

### `RouteConfig`

```typescript
interface RouteConfig {
  guards?: Middleware[];
  loader?: (ctx: any) => Promise<any>;
  component?: any;
}
```

### `ResolvedRouteConfig`

```typescript
interface ResolvedRouteConfig {
  guards: Middleware[];
  loader?: (ctx: any) => Promise<any>;
  component: any;
}
```

## 📚 Examples

### Complete Usage

```typescript
// src/app/index.tsx
import { createServerData } from "@leeforge/fusion/data";
import { useServerAction } from "@leeforge/fusion/client";

export async function incrementCounter() {
  return { count: 42 };
}

export default function Home() {
  const data = createServerData(async () => {
    return { message: "Hello from server" };
  });

  const [increment, { loading }] = useServerAction(incrementCounter);

  return (
    <div>
      <h1>{data().message}</h1>
      <button onClick={increment} disabled={loading}>
        {loading ? "Loading..." : "Increment"}
      </button>
    </div>
  );
}
```

### Middleware Chain

```typescript
// src/middleware/auth.ts
import { createMiddleware } from "@leeforge/fusion/middleware";

export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await validateToken(token);
  ctx.set("user", user);

  await next();
});

export const requireAdmin = createMiddleware(async (ctx, next) => {
  const user = ctx.get("user");

  if (!user || user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await next();
});

// Combine guards
export const requireAuthAndAdmin = createGuardChain(
  requireAuth(),
  requireAdmin(),
);
```

### API Route with Validation

```typescript
// src/app/api/users/route.ts
export async function POST({ request }) {
  const data = await request.json();

  // Validate
  if (!data.email || !data.password) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return Response.json({ error: "Invalid email format" }, { status: 400 });
  }

  // Create user
  const user = await db.users.create(data);
  return Response.json(user, { status: 201 });
}
```

## 🎯 Best Practices

### 1. Use Server Data Loading

```tsx
// ✅ Good
export default function Blog() {
  const posts = createServerData(async () => {
    return await fetchPosts();
  });
  return (
    <div>
      {posts().map((post) => (
        <PostCard {...post} />
      ))}
    </div>
  );
}
```

### 2. Handle Errors

```tsx
// ✅ Good
export default function ErrorBoundary() {
  const error = useRouteError();
  return <div>Error: {error?.message}</div>;
}
```

### 3. Use Route Guards

```tsx
// ✅ Good
export const guards = [requireAuth()];
```

### 4. Validate Input

```tsx
// ✅ Good
export async function POST({ request }) {
  const data = await request.json();

  if (!data.email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  // Continue...
}
```

## 📚 Next Steps

- [Quick Start](/quick-start) - Get started in 5 minutes
- [Core Concepts](/core-concepts) - Understand the framework
- [CLI Reference](/cli) - All CLI commands
