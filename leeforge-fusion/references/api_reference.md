# Leeforge Fusion API Reference

## CLI Commands

### `init`

Initialize a new Leeforge Fusion project.

**Syntax:**

```bash
leeforge-fusion init [name] [options]
```

**Arguments:**

- `name`: Project name (default: "my-app")

**Options:**

- `-t, --template <type>`: Template to use (basic, blog, dashboard) (default: "basic")
- `--git`: Initialize git repository
- `--install`: Install dependencies automatically
- `--pm <manager>`: Package manager (npm, yarn, pnpm)

**Available Templates:**

- **basic**: Simple app with home and about pages
- **blog**: Blog with posts, categories, and RSS
- **dashboard**: Admin dashboard with authentication

**Examples:**

```bash
leeforge-fusion init my-app
leeforge-fusion init my-blog --template blog --git --install
leeforge-fusion init my-dashboard --template dashboard --pm pnpm
```

### `dev`

Start the development server.

**Syntax:**

```bash
leeforge-fusion dev [options]
```

**Options:**

- `-p, --port <number>`: Port number (default: 3000)
- `--host <address>`: Host address (default: localhost)
- `--config <path>`: Custom config file path
- `--open`: Open browser automatically
- `--https`: Use HTTPS with self-signed certificate

**Features:**

- Hot Module Replacement (HMR)
- Automatic app directory detection
- Config file support
- TypeScript support

**Examples:**

```bash
leeforge-fusion dev
leeforge-fusion dev --port 3001 --open
leeforge-fusion dev --https
```

### `build`

Build the application for production.

**Syntax:**

```bash
leeforge-fusion build [options]
```

**Options:**

- `--outDir <path>`: Output directory (default: dist)
- `--sourcemap`: Generate source maps
- `--mode <mode>`: Build mode (production, development)
- `--analyze`: Analyze bundle size
- `--minify`: Minify output

**Build Output:**

```
dist/
├── client/           # Client-side bundles
│   ├── index.js
│   ├── vendor.js
│   └── assets/
└── server/           # Server-side bundle
    └── entry-server.js
```

**Examples:**

```bash
leeforge-fusion build
leeforge-fusion build --sourcemap --analyze
leeforge-fusion build --outDir ./build
```

### `generate`

Generate code scaffolding.

**Syntax:**

```bash
leeforge-fusion generate <type> <name> [options]
leeforge-fusion g <type> <name> [options]
```

**Arguments:**

- `type`: Type to generate (page, api, component, middleware, layout)
- `name`: Name of the item (e.g., "blog/[id]", "users/[id]", "Button")

**Options:**

- `--dry-run`: Show what would be generated without creating files
- `--force`: Overwrite existing files
- `--typescript`: Generate TypeScript files
- `--css`: Include CSS module
- `--test`: Include test file

**Supported Types:**

- **page**: Generate a page component
- **api**: Generate an API route
- **component**: Generate a component
- **middleware**: Generate middleware
- **layout**: Generate a layout component

**Examples:**

```bash
leeforge-fusion generate page blog/[id]
leeforge-fusion generate api users/[id]
leeforge-fusion generate component Button --test --css
leeforge-fusion generate middleware auth
leeforge-fusion generate page about --dry-run
leeforge-fusion g page contact
```

## Framework API

### Configuration

#### `defineConfig`

Define Leeforge Fusion configuration.

**Type:**

```typescript
function defineConfig(config: LeeforgeConfig): LeeforgeConfig;
```

**Parameters:**

```typescript
interface LeeforgeConfig {
  routes?: Record<string, GuardFunction[]>;
  api?: {
    prefix?: string;
    timeout?: number;
  };
  ssr?: {
    render?: "stream" | "static";
    timeout?: number;
  };
  vite?: ViteConfig;
}
```

**Example:**

```typescript
import { defineConfig } from "leeforge-fusion";
import { requireAuth, requireAdmin } from "leeforge-fusion/middleware";

export default defineConfig({
  routes: {
    "/admin/*": [requireAuth(), requireAdmin()],
  },
  api: {
    prefix: "/api",
    timeout: 5000,
  },
  vite: {
    server: {
      port: 3000,
    },
  },
});
```

### Middleware & Route Guards

#### `requireAuth`

Guard that requires authentication.

**Type:**

```typescript
function requireAuth(): GuardFunction;
```

**Behavior:**

- Throws redirect to `/login` if no user in context
- Passes if user exists

**Example:**

```typescript
import { requireAuth } from "leeforge-fusion/middleware";

export const authGuard = requireAuth();
```

#### `requireAdmin`

Guard that requires admin role.

**Type:**

```typescript
function requireAdmin(): GuardFunction;
```

**Behavior:**

- Throws redirect to `/login` if no user
- Throws redirect to `/unauthorized` if user.role !== "admin"
- Passes if user.role === "admin"

**Example:**

```typescript
import { requireAdmin } from "leeforge-fusion/middleware";

export const adminGuard = requireAdmin();
```

#### `requireGuest`

Guard that requires no authentication.

**Type:**

```typescript
function requireGuest(): GuardFunction;
```

**Behavior:**

- Throws redirect to `/dashboard` if user exists
- Passes if no user

**Example:**

```typescript
import { requireGuest } from "leeforge-fusion/middleware";

export const guestGuard = requireGuest();
```

#### `defineGuard`

Create a custom guard function.

**Type:**

```typescript
function defineGuard(
  handler: (ctx: LoaderContext) => Promise<void> | void,
): GuardFunction;
```

**Parameters:**

- `handler`: Function that receives `LoaderContext` and can throw redirect

**Example:**

```typescript
import { defineGuard, redirect } from "leeforge-fusion/middleware";

export const requireVerified = defineGuard((ctx) => {
  if (!ctx.user?.verified) {
    throw redirect("/verify-email");
  }
});
```

#### `createGuardChain`

Combine multiple guards into a chain.

**Type:**

```typescript
function createGuardChain(...guards: GuardFunction[]): GuardFunction;
```

**Parameters:**

- `guards`: Variable number of guard functions

**Example:**

```typescript
import {
  createGuardChain,
  requireAuth,
  requireAdmin,
} from "leeforge-fusion/middleware";

export const adminOnly = createGuardChain(requireAuth(), requireAdmin());
```

#### `redirect`

Create a redirect error.

**Type:**

```typescript
function redirect(location: string, status?: number): RedirectError;
```

**Parameters:**

- `location`: URL to redirect to
- `status`: HTTP status code (default: 302)

**Example:**

```typescript
import { redirect } from "leeforge-fusion/middleware";

throw redirect("/login");
throw redirect("/unauthorized", 403);
```

#### `isRedirectError`

Check if an error is a redirect error.

**Type:**

```typescript
function isRedirectError(error: unknown): boolean;
```

**Example:**

```typescript
import { isRedirectError } from "leeforge-fusion/middleware";

try {
  await guard(ctx);
} catch (error) {
  if (isRedirectError(error)) {
    // Handle redirect
  }
}
```

### Middleware (Hono-based)

#### `authMiddleware`

Authentication middleware.

**Type:**

```typescript
const authMiddleware: Middleware;
```

#### `loggerMiddleware`

Request logging middleware.

**Type:**

```typescript
const loggerMiddleware: Middleware;
```

#### `corsMiddleware`

CORS middleware.

**Type:**

```typescript
const corsMiddleware: Middleware;
```

#### `composeMiddleware`

Compose multiple middleware into a chain.

**Type:**

```typescript
function composeMiddleware(middleware: Middleware[]): Middleware;
```

**Example:**

```typescript
import {
  composeMiddleware,
  authMiddleware,
  loggerMiddleware,
} from "leeforge-fusion/middleware";

const middlewareChain = composeMiddleware([loggerMiddleware, authMiddleware]);
```

### Data Layer

#### `createServerData`

Create server-side data loader.

**Type:**

```typescript
function createServerData<T>(
  loader: (ctx: LoaderContext) => Promise<T>,
): () => T | undefined;
```

**Parameters:**

- `loader`: Async function that receives `LoaderContext`

**Example:**

```typescript
import { createServerData } from "leeforge-fusion/data";

export default function BlogPost() {
  const post = createServerData(async ({ params }) => {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    return res.json();
  });

  return <article>{post().title}</article>;
}
```

#### `apiFetch`

Fetch data from API with automatic error handling.

**Type:**

```typescript
function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response>;
```

**Example:**

```typescript
import { apiFetch } from "leeforge-fusion/data";

const data = await apiFetch("/api/users");
const response = await apiFetch("/api/users", {
  method: "POST",
  body: JSON.stringify({ name: "John" }),
});
```

#### `withAuth`

Add authentication headers to request.

**Type:**

```typescript
function withAuth(token: string): Record<string, string>;
```

**Example:**

```typescript
import { apiFetch, withAuth } from "leeforge-fusion/data";

const data = await apiFetch("/api/users", {
  headers: withAuth("your-token"),
});
```

#### `withJson`

Add JSON content type header.

**Type:**

```typescript
function withJson(data: any): string;
```

**Example:**

```typescript
import { apiFetch, withJson } from "leeforge-fusion/data";

const data = await apiFetch("/api/users", {
  method: "POST",
  body: withJson({ name: "John" }),
});
```

#### `withMethod`

Add HTTP method to request.

**Type:**

```typescript
function withMethod(method: string): Record<string, string>;
```

**Example:**

```typescript
import { apiFetch, withMethod } from "leeforge-fusion/data";

const data = await apiFetch("/api/users", {
  headers: withMethod("POST"),
});
```

#### `getAuthHeaders`

Get authentication headers.

**Type:**

```typescript
function getAuthHeaders(token: string): Record<string, string>;
```

**Example:**

```typescript
import { getAuthHeaders } from "leeforge-fusion/data";

const headers = getAuthHeaders("your-token");
```

#### `withAuthHeaders`

Add authentication headers to existing headers.

**Type:**

```typescript
function withAuthHeaders(
  token: string,
  headers?: Record<string, string>,
): Record<string, string>;
```

**Example:**

```typescript
import { apiFetch, withAuthHeaders } from "leeforge-fusion/data";

const data = await apiFetch("/api/users", {
  headers: withAuthHeaders("your-token", {
    "Content-Type": "application/json",
  }),
});
```

### Server Actions

#### `useServerAction`

Hook for using server actions in components.

**Type:**

```typescript
function useServerAction<T>(
  action: (...args: any[]) => Promise<T>,
): [
  handler: (...args: any[]) => Promise<T>,
  state: { loading: boolean; error: Error | null },
];
```

**Example:**

```typescript
import { useServerAction } from "leeforge-fusion/client";

async function createPost(data: { title: string; content: string }) {
  return { id: Date.now(), ...data };
}

function CreatePost() {
  const [create, { loading }] = useServerAction(createPost);

  return (
    <form onSubmit={create}>
      <input name="title" />
      <button disabled={loading}>Create</button>
    </form>
  );
}
```

## Types

### `LoaderContext`

Context passed to loaders and guards.

**Type:**

```typescript
interface LoaderContext {
  params: Record<string, string>;
  request: Request;
  user?: {
    id: string;
    role: string;
    [key: string]: any;
  };
  queryClient?: any;
}
```

### `GuardFunction`

Function that validates route access.

**Type:**

```typescript
type GuardFunction = (ctx: LoaderContext) => Promise<void>;
```

### `RedirectError`

Error thrown for redirects.

**Type:**

```typescript
interface RedirectError extends Error {
  location: string;
  status: number;
}
```

### `Middleware`

Hono-style middleware function.

**Type:**

```typescript
type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;
```

### `Context`

Hono context object.

**Type:**

```typescript
interface Context {
  req: Request;
  res: Response;
  [key: string]: any;
}
```

## File Conventions

### Page Files (`src/app/**/*.tsx`)

**Required Export:**

```typescript
export default function Page() {
  return <div>Content</div>;
}
```

**Optional Exports:**

```typescript
// Server-side data loader
export const loader = async ({ params, queryClient }) => {
  return { data: "value" };
};

// Route guards
export const guards = [requireAuth(), requireAdmin()];
```

### API Route Files (`src/app/api/**/*.ts`)

**Required Exports:**

```typescript
export async function GET({ request, params }) {
  return Response.json({ data: "value" });
}

export async function POST({ request, params }) {
  const body = await request.json();
  return Response.json({ data: body });
}
```

**Supported Methods:**

- GET
- POST
- PUT
- PATCH
- DELETE
- OPTIONS
- HEAD

### Layout Files (`src/app/layout.tsx`)

**Required Export:**

```typescript
export default function Layout({ children }: any) {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <header>Header</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

### Middleware Files (`src/middleware/**/*.ts`)

**Required Export:**

```typescript
export const requireAuth = requireAuth();
export const requireAdmin = requireAdmin();

export const customGuard = defineGuard((ctx) => {
  if (!ctx.user?.verified) {
    throw redirect("/verify-email");
  }
});
```

## Configuration Files

### `leeforge.config.ts`

**Full Configuration:**

```typescript
import { defineConfig } from "leeforge-fusion";
import { requireAuth, requireAdmin } from "leeforge-fusion/middleware";

export default defineConfig({
  // Route guards
  guards: {
    "/admin/*": "./src/middleware/auth.ts",
  },

  // API configuration
  api: {
    prefix: "/api",
    timeout: 5000,
  },

  // SSR configuration
  ssr: {
    render: "stream", // or "static"
    timeout: 10000,
  },

  // Vite configuration
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

### `package.json`

**Required Dependencies:**

```json
{
  "dependencies": {
    "leeforge-fusion": "^0.1.0",
    "solid-js": "^1.9.0",
    "@tanstack/solid-router": "^1.150.0",
    "@tanstack/solid-query": "^5.90.20"
  }
}
```

**Recommended Scripts:**

```json
{
  "scripts": {
    "dev": "leeforge-fusion dev",
    "build": "leeforge-fusion build",
    "preview": "leeforge-fusion build && node dist/server/entry-server.js",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

### `tsconfig.json`

**Recommended Configuration:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

## Project Structure

### Standard Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── index.tsx           # Home page (/)
│   │   ├── about.tsx           # About page (/about)
│   │   ├── blog/
│   │   │   ├── index.tsx       # Blog list (/blog)
│   │   │   └── [id].tsx        # Blog post (/blog/:id)
│   │   └── api/
│   │       └── users/
│   │           └── route.ts    # API route (/api/users)
│   ├── middleware/
│   │   └── auth.ts             # Authentication middleware
│   └── components/
│       └── Button/
│           └── Button.tsx      # Reusable component
├── leeforge.config.ts          # Configuration
├── package.json
└── tsconfig.json
```

### Generated Structure

```
my-app/
├── app/
│   ├── blog/[id]/
│   │   └── index.tsx           # Generated page
│   └── api/users/[id]/
│       └── route.ts            # Generated API
├── components/
│   └── Button/
│       └── Button.tsx          # Generated component
└── ...
```

## Performance Metrics

### Build Time

- **Small apps**: ~2 seconds
- **Medium apps**: ~5-10 seconds
- **Large apps**: ~10-20 seconds

### Bundle Size

- **Client bundle**: ~15KB (gzipped)
- **Server bundle**: ~50KB (gzipped)
- **Vendor chunks**: Automatic code splitting

### SSR Performance

- **Response time**: ~50ms per request
- **Streaming**: Progressive HTML streaming
- **Caching**: Intelligent caching strategies

### Development

- **Startup time**: <1 second
- **HMR updates**: <100ms
- **Type checking**: Incremental

## Testing

### Unit Tests (Vitest)

```typescript
// tests/unit/middleware/route-guard.test.ts
import { describe, test, expect } from "vitest";
import { requireAuth, defineGuard } from "../../src/middleware/route-guard";

describe("Route Guards", () => {
  test("requireAuth passes when user exists", async () => {
    const ctx = {
      user: { id: "123", role: "user" },
      params: {},
      request: new Request("http://localhost"),
    };

    await expect(requireAuth(ctx)).resolves.not.toThrow();
  });
});
```

### Integration Tests (Vitest)

```typescript
// tests/integration/ssr.test.ts
import { describe, test, expect } from "vitest";
import { RouteScanner } from "../../src/router/scanner";

describe("SSR Integration", () => {
  test("complete SSR flow", async () => {
    const scanner = new RouteScanner({ appDir: "src/app" });
    const scanResult = await scanner.scan();

    expect(scanResult.routes.length).toBeGreaterThan(0);
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/basic-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Basic User Flow", () => {
  test("Visit home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Leeforge/);
  });
});
```

## Common Patterns

### Authentication Flow

1. Create middleware with `requireAuth()`
2. Apply guard to routes in `leeforge.config.ts`
3. Use `createServerData()` for protected data
4. Handle redirects with `redirect()`

### API Development

1. Create route files in `src/app/api/`
2. Export HTTP method handlers
3. Use `Response.json()` for responses
4. Apply middleware for authentication

### Code Generation

1. Use `--dry-run` to preview
2. Generate pages, APIs, and components
3. Customize generated code
4. Test with `npm test`

### Production Build

1. Run `leeforge-fusion build`
2. Check `dist/` directory
3. Deploy to hosting platform
4. Monitor performance

## Troubleshooting

### Build Errors

- **Missing app directory**: Create `src/app/` with at least one page
- **Type errors**: Run `npm run typecheck`
- **Missing dependencies**: Install required packages

### Runtime Errors

- **Port in use**: Use `--port` flag with different port
- **Config not found**: Create `leeforge.config.ts`
- **Route not found**: Check file naming conventions

### Generation Errors

- **File exists**: Use `--force` to overwrite
- **Invalid name**: Use proper naming (e.g., "blog/[id]")
- **Missing dependencies**: Install CLI globally or use npx

## Resources

### Official Documentation

- **GitHub**: https://github.com/JsonLee12138/leeforge-fusion
- **NPM**: https://www.npmjs.com/package/@leeforge/fusion-cli
- **Issues**: https://github.com/JsonLee12138/leeforge-fusion/issues

### Community

- **Discussions**: GitHub Discussions
- **Discord**: Coming soon
- **Contributing**: See CONTRIBUTING.md

### Related Tools

- **Solid.js**: https://www.solidjs.com/
- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query
- **Hono**: https://hono.dev/
- **Vite**: https://vitejs.dev/
