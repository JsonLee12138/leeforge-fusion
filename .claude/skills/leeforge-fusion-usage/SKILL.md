---
name: leeforge-fusion-usage
description: Leeforge Fusion framework usage guide - A full-stack SSR framework with file-based routing, middleware, and server actions. Use this skill when working with Leeforge Fusion projects, especially when debugging routing issues, understanding framework architecture, or implementing features.
---

# Leeforge Fusion Usage Guide

## Overview

Leeforge Fusion is a modern full-stack framework built on Solid.js that provides:

- **File-based routing** with automatic code generation
- **Server-side rendering** with seamless hydration
- **Middleware system** for authentication, logging, and more
- **Server actions** for type-safe RPC
- **Zero configuration** - works out of the box
- **Developer experience** with HMR and clear errors

## When to Use This Skill

Use this skill when:

- Working with Leeforge Fusion projects (`@packages/leeforge-fusion/` or `@packages/cli/`)
- Debugging routing issues (routes not found, wrong routes displayed)
- Understanding framework architecture and code structure
- Implementing new features in Leeforge Fusion
- Reviewing or modifying CLI commands
- Troubleshooting dev server behavior
- Working with route scanning, generation, or middleware

## Core Concepts

### 1. Project Structure

```
leeforge/
├── packages/
│   ├── cli/                    # CLI tool for scaffolding and dev server
│   │   ├── src/
│   │   │   ├── commands/       # CLI commands
│   │   │   │   ├── build.ts    # Build command
│   │   │   │   ├── dev.ts      # Dev server command
│   │   │   │   ├── generate.ts # Code generation command
│   │   │   │   └── init.ts     # Project initialization
│   │   │   └── generators/     # Code generators
│   │   └── package.json
│   └── leeforge-fusion/        # Core framework
│       ├── src/
│       │   ├── router/         # Routing system
│       │   │   ├── scanner.ts  # Route scanner
│       │   │   ├── generator.ts # Route generator
│       │   │   └── types.ts    # Route types
│       │   ├── config/         # Configuration
│       │   │   ├── loader.ts   # Config loader
│       │   │   └── route-config.ts # Route config
│       │   ├── middleware/     # Middleware system
│       │   │   ├── hono.ts     # Hono middleware
│       │   │   └── route-guard.ts # Route guards
│       │   ├── ssr/            # SSR engine
│       │   │   ├── renderer.ts # SSR renderer
│       │   │   └── template.ts # HTML template
│       │   ├── api/            # API system
│       │   │   ├── scanner.ts  # API scanner
│       │   │   └── registry.ts # API registry
│       │   ├── data/           # Data layer
│       │   │   ├── fetch.ts    # API fetch
│       │   │   └── auth.ts     # Auth helpers
│       │   ├── query/          # Query layer
│       │   │   ├── client.ts   # Query client
│       │   │   └── index.ts    # Query exports
│       │   ├── server-actions/ # Server actions
│       │   ├── client/         # Client hydration
│       │   ├── types/          # Type definitions
│       │   ├── dev-server.ts   # Dev server
│       │   ├── prod-server.ts  # Prod server
│       │   ├── vite-plugin.ts  # Vite plugin
│       │   └── index.ts        # Main exports
│       ├── test-app/           # Test application
│       ├── tests/              # Test suite
│       └── package.json
```

### 2. File-Based Routing

Routes are automatically generated from the `src/app/` directory:

```
src/app/
├── index.tsx           → /
├── about.tsx           → /about
├── blog/
│   ├── index.tsx       → /blog
│   ├── [id].tsx        → /blog/:id
│   └── new.tsx         → /blog/new
└── (dashboard)/
    └── settings.tsx    → /dashboard/settings
```

**Supported file names:**

- `page.tsx` - Standard page
- `index.tsx` - Index page (maps to directory path)
- `about.tsx` - About page (maps to `/about`)
- `new.tsx` - New page (maps to `/new`)
- `[id].tsx` - Dynamic route (maps to `/:id`)
- `layout.tsx` - Layout component
- `route.tsx` - API route
- `page.server.tsx` - Server-side page

### 3. Route Scanner

The `RouteScanner` class scans the app directory for routes:

```typescript
import { RouteScanner } from "@leeforge/fusion";

const scanner = new RouteScanner({
  appDir: "/path/to/app",
  ignore: ["**/node_modules/**"],
  cache: false,
});

const result = await scanner.scan();
// result.routes: Route[]
// result.fileMap: Map<string, Route>
// result.conflicts: RouteConflict[]
```

### 4. Configuration

Create `leeforge.config.ts` in your project root:

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  guards: {
    "/dashboard/*": "./src/middleware/auth.ts",
    "/admin/*": "./src/middleware/auth.ts",
  },
  api: {
    prefix: "/api",
  },
  vite: {
    server: {
      port: 3000,
    },
  },
});
```

## CLI Commands

### `leeforge init`

Initialize a new Leeforge Fusion project:

```bash
leeforge init my-app
leeforge init my-blog --template blog
```

### `leeforge dev`

Start the development server:

```bash
leeforge dev
leeforge dev --port 3000
```

**How it works:**

1. Detects the app directory (checks `src/app`, `app`, `src`, `.`)
2. Loads configuration from `leeforge.config.ts`
3. Starts Vite dev server with HMR
4. Scans routes from the app directory
5. Serves pages based on file-based routing

### `leeforge build`

Build for production:

```bash
leeforge build
```

### `leeforge generate`

Generate code scaffolding:

```bash
# Generate a page
leeforge generate page blog/[id]

# Generate an API route
leeforge generate api users/[id]

# Generate a component
leeforge generate component Button

# Preview without creating files
leeforge generate page about --dry-run
```

## API Reference

### Core Exports

```typescript
// @leeforge/fusion
export {
  // Routing
  RouteScanner,
  RouteGenerator,
  formatRoutePath,
  isDynamicRoute,
  getRouteDepth,
  findRouteByPath,
  flattenRoutes,

  // Configuration
  loadConfig,
  extractViteConfig,
  defineConfig,
  RouteConfigManager,

  // Middleware
  authMiddleware,
  loggerMiddleware,
  errorMiddleware,
  corsMiddleware,
  composeMiddleware,

  // Guards
  requireAuth,
  requireAdmin,
  requireGuest,
  defineGuard,
  createGuardChain,

  // Server Actions
  createAction,
  isServerAction,
  getServerActionName,

  // SSR
  startDevServer,
  frameworkPlugin,

  // Query
  createQueryClient,
  hydrateQueryClient,

  // Data
  apiFetch,
  withAuth,
  withJson,
  withMethod,

  // Auth
  getAuthHeaders,
  withAuthHeaders,

  // Redirect
  redirect,
  isRedirectError,
  getRedirectLocation,
  getRedirectStatus,

  // API
  APIScanner,
  APIRegistry,
  apiLoggerMiddleware,
  apiErrorMiddleware,
  apiCorsMiddleware,

  // Types
  // ... all type exports
} from "@leeforge/fusion";
```

### RouteScanner API

```typescript
interface ScannerConfig {
  appDir: string;
  ignore?: string[];
  cache?: boolean;
}

interface Route {
  path: string;
  file: string;
  type: RouteType; // "page" | "layout" | "api" | "server"
  params: string[];
  children?: Route[];
  componentName?: string;
  importName?: string;
}

interface ScanResult {
  routes: Route[];
  fileMap: Map<string, Route>;
  conflicts: Array<{ route: Route; reason: string }>;
}

class RouteScanner {
  constructor(config: ScannerConfig);
  scan(): Promise<ScanResult>;
}
```

### DevServer API

```typescript
interface DevServerOptions {
  port: number;
  appDir: string;
  apiDir?: string;
  rootDir?: string;
}

function startDevServer(options: DevServerOptions): Promise<{
  server: http.Server;
  vite: ViteDevServer;
}>;
```

## Common Patterns

### 1. Dynamic Routes

```tsx
// src/app/blog/[id].tsx
import { createServerData } from "@leeforge/fusion/data";

export default function BlogPost() {
  const post = createServerData(async ({ params }) => {
    return await fetchPost(params.id);
  });

  return <article>{post().title}</article>;
}
```

### 2. Route Guards

```typescript
// src/middleware/auth.ts
import { requireAuth, requireAdmin } from "@leeforge/fusion/middleware";

export const adminGuard = createGuardChain(requireAuth(), requireAdmin());
```

### 3. API Routes

```typescript
// src/app/api/users/route.ts
export async function GET({ request, params }) {
  return Response.json({ users: [...] });
}

export async function POST({ request, params }) {
  const data = await request.json();
  return Response.json({ id: Date.now(), ...data });
}
```

### 4. Server Actions

```tsx
// src/app/blog/new.tsx
import { useServerAction } from "@leeforge/fusion/client";

export async function createPost(data: { title: string; content: string }) {
  // Server-only code
  return { id: Date.now(), ...data };
}

export default function NewPost() {
  const [create, { loading }] = useServerAction(createPost);

  return (
    <form onSubmit={create}>
      <input name="title" />
      <button disabled={loading}>Create</button>
    </form>
  );
}
```

## Troubleshooting

### Issue: Routes not found

**Solution:**

1. Check that files are in `src/app/` directory
2. Verify file naming: `page.tsx`, `index.tsx`, `about.tsx`, `new.tsx`, `[id].tsx`
3. Run `leeforge dev` with `DEBUG=leeforge:*` to see debug logs

### Issue: Dev server shows wrong app

**Solution:**

1. Check `leeforge.config.ts` for correct `appDir` setting
2. Verify you're in the correct project directory
3. Check that `package.json` has correct `name` field

### Issue: Type errors

**Solution:**

1. Run `pnpm run typecheck` to see all type errors
2. Check that all dependencies are installed
3. Verify TypeScript version matches requirements

## Best Practices

1. **Use TypeScript**: Leeforge Fusion is built with TypeScript
2. **Follow naming conventions**: Use `page.tsx`, `index.tsx`, etc.
3. **Keep routes organized**: Use route groups `(dashboard)/` for organization
4. **Use server actions**: For type-safe RPC between client and server
5. **Add tests**: Write unit and integration tests for your routes
6. **Use middleware**: For cross-cutting concerns like auth, logging
7. **Follow existing patterns**: Check `test-app/` for examples

## Resources

- **Documentation**: `/docs/` directory
- **Examples**: `test-app/` directory
- **Tests**: `tests/` directory
- **GitHub**: https://github.com/code-yeongyu/leeforge

## Version

Current version: `0.1.0-beta.1`

## License

MIT License - see LICENSE for details
