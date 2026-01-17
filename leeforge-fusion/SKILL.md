---
name: leeforge-fusion
description: Full-stack SSR framework with file-based routing, middleware, and server actions. Use when building or working with Leeforge Fusion applications, creating routes, implementing authentication, or generating code scaffolding.
---

# Leeforge Fusion

## Overview

Leeforge Fusion is a modern full-stack framework built on Solid.js that provides file-based routing, server-side rendering, middleware system, and server actions. This skill provides comprehensive guidance for building and working with Leeforge Fusion applications.

## Core Capabilities

### 1. Project Initialization & Setup

**When to use:** Starting a new Leeforge Fusion project or setting up an existing one.

**CLI Commands:**

```bash
# Initialize new project with basic template
leeforge-fusion init my-app

# Initialize with specific template
leeforge-fusion init my-blog --template blog
leeforge-fusion init my-dashboard --template dashboard

# Initialize with git and auto-install
leeforge-fusion init my-app --git --install --pm pnpm
```

**Available Templates:**

- **basic**: Simple app with home and about pages (best for learning)
- **blog**: Blog with posts, categories, and RSS (best for content sites)
- **dashboard**: Admin dashboard with authentication (best for business apps)

**Project Structure After Init:**

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── index.tsx           # Home page (/)
│   │   └── about.tsx           # About page (/about)
│   └── middleware/
│       └── auth.ts             # Authentication middleware
├── leeforge.config.ts          # Configuration
├── package.json
└── tsconfig.json
```

**Dependencies to Install:**

```bash
npm install leeforge-fusion solid-js @tanstack/solid-router @tanstack/solid-query
```

### 2. File-Based Routing

**When to use:** Creating routes and page components in Leeforge Fusion applications.

**Route File Patterns:**

```
src/app/
├── index.tsx           → /
├── about.tsx           → /about
├── blog/
│   ├── index.tsx       → /blog
│   └── [id].tsx        → /blog/:id
└── (dashboard)/
    └── settings.tsx    → /dashboard/settings
```

**Dynamic Routes:**

```tsx
// src/app/blog/[id].tsx
import { Route } from "@tanstack/solid-router";

export default function BlogPost() {
  const { id } = Route.useParams();

  return <article>Post ID: {id}</article>;
}
```

**Route Groups (for organization without affecting URL):**

- Use parentheses: `(dashboard)/settings.tsx`
- Useful for organizing routes by feature or section

**Layouts:**

```tsx
// src/app/layout.tsx
export default function Layout({ children }: any) {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <header>My Header</header>
        <main>{children}</main>
        <footer>My Footer</footer>
      </body>
    </html>
  );
}
```

**Server-Side Data Loading:**

```tsx
// src/app/blog/[id].tsx
import { createServerData } from "leeforge-fusion/data";
import { Route } from "@tanstack/solid-router";

export default function BlogPost() {
  const { id } = Route.useParams();

  const post = createServerData(async ({ params }) => {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    return res.json();
  });

  return <article>{post().title}</article>;
}

export const loader = async ({ params, queryClient }) => {
  return { message: "Hello from blog/[id]" };
};
```

### 3. Middleware & Route Guards

**When to use:** Implementing authentication, authorization, logging, or cross-cutting concerns.

**Built-in Guards:**

```typescript
import {
  requireAuth,
  requireAdmin,
  requireGuest,
  createGuardChain,
  defineGuard,
} from "leeforge-fusion/middleware";
```

**Route Guard Examples:**

```typescript
// src/middleware/auth.ts
export const requireAuth = requireAuth();
export const requireAdmin = requireAdmin();
export const requireGuest = requireGuest();

// Custom guard
export const requireVerified = defineGuard((ctx) => {
  if (!ctx.user?.verified) {
    throw redirect("/verify-email");
  }
});

// Combined guard chain
export const adminOnly = createGuardChain(requireAuth, requireAdmin);
```

**Configuration (leeforge.config.ts):**

```typescript
import { defineConfig } from "leeforge-fusion";
import { requireAuth, requireAdmin } from "leeforge-fusion/middleware";

export default defineConfig({
  routes: {
    "/admin/*": [requireAuth(), requireAdmin()],
    "/dashboard/*": [requireAuth()],
    "/login": [requireGuest()],
  },
});
```

**Middleware System (Hono-based):**

```typescript
import {
  authMiddleware,
  loggerMiddleware,
  corsMiddleware,
  composeMiddleware,
} from "leeforge-fusion/middleware";

// Compose multiple middleware
const middlewareChain = composeMiddleware([
  loggerMiddleware,
  corsMiddleware,
  authMiddleware,
]);
```

### 4. Code Generation

**When to use:** Scaffolding new pages, API routes, or components quickly.

**CLI Commands:**

```bash
# Generate a page
leeforge-fusion generate page blog/[id]

# Generate an API route
leeforge-fusion generate api users/[id]

# Generate a component
leeforge-fusion generate component Button

# Generate middleware
leeforge-fusion generate middleware auth

# Preview without creating files
leeforge-fusion generate page about --dry-run

# Force overwrite existing files
leeforge-fusion generate page blog --force

# Using alias
leeforge-fusion g page contact
```

**Generated Page Example:**

```bash
leeforge-fusion generate page blog/[id]
```

**Generated Files:**

```
app/blog/[id]/
└── index.tsx          # Main page component
```

**Generated Code:**

```typescript
// app/blog/[id]/index.tsx
import { createSignal } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function Page() {
  const [count, setCount] = createSignal(0);
  const data = createServerData(async ({ params, queryClient }) => {
    return { message: "Hello from blog/[id]" };
  });

  return (
    <div>
      <h1>blog/[id]</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <p>Data: {data()?.message}</p>
    </div>
  );
}

export const loader = async ({ queryClient, params }) => {
  return { message: "Hello from blog/[id]" };
};

export const guards = [];
```

**Generated API Route Example:**

```bash
leeforge-fusion generate api users/[id]
```

**Generated Code:**

```typescript
// app/api/users/[id]/route.ts
export async function GET({ request, params }) {
  return Response.json({ message: "GET users/[id]" });
}

export async function POST({ request, params }) {
  const body = await request.json();
  return Response.json({ message: "POST users/[id]", data: body });
}
```

### 5. Development & Build

**When to use:** Running development server or building for production.

**Development Server:**

```bash
# Start on default port (3000)
leeforge-fusion dev

# Start on custom port
leeforge-fusion dev --port 3001

# Start with host binding
leeforge-fusion dev --host 0.0.0.0

# Start with custom config
leeforge-fusion dev --config ./custom.config.ts
```

**Features:**

- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh
- ✅ Error overlay
- ✅ TypeScript support
- ✅ Automatic routing

**Production Build:**

```bash
# Standard build
leeforge-fusion build

# Build with custom output directory
leeforge-fusion build --outDir dist

# Build with source maps
leeforge-fusion build --sourcemap

# Build for specific environment
leeforge-fusion build --mode production
```

**Build Output:**

```
dist/
├── client/           # Client-side bundles
│   ├── index.js
│   ├── vendor.js     # SolidJS, TanStack libraries
│   └── assets/
└── server/           # Server-side bundle
    └── entry-server.js
```

### 6. Configuration

**When to use:** Customizing framework behavior, API routes, or build settings.

**leeforge.config.ts:**

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

  // Vite configuration (merged with framework defaults)
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

**Configuration Options:**

- **routes**: Route guards and middleware
- **api**: API configuration (prefix, timeout)
- **ssr**: SSR configuration (render mode, timeout)
- **vite**: Vite configuration (merged with defaults)

### 7. Server Actions & Data Layer

**When to use:** Implementing type-safe server-side functions and data fetching.

**Server Actions:**

```typescript
// src/app/api/actions.ts
export async function createPost(data: { title: string; content: string }) {
  // Server-only code
  return { id: Date.now(), ...data };
}

// In component
import { useServerAction } from "leeforge-fusion/client";

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

**Data Fetching:**

```typescript
import { apiFetch, withAuth, withJson } from "leeforge-fusion/data";

// Basic API call
const data = await apiFetch("/api/users");

// With authentication
const data = await apiFetch("/api/users", {
  headers: withAuth("your-token"),
});

// With JSON body
const data = await apiFetch("/api/users", {
  method: "POST",
  body: withJson({ name: "John" }),
});
```

**Auth Helpers:**

```typescript
import { getAuthHeaders, withAuthHeaders } from "leeforge-fusion/data";

// Get auth headers
const headers = getAuthHeaders("your-token");

// With auth headers
const data = await apiFetch("/api/users", {
  headers: withAuthHeaders("your-token"),
});
```

## Workflow Examples

### Example 1: Building a Blog Application

**Step 1: Initialize Project**

```bash
leeforge-fusion init my-blog --template blog
cd my-blog
npm install
```

**Step 2: Create Routes**

```bash
# Create blog list page
leeforge-fusion generate page blog

# Create individual post page
leeforge-fusion generate page blog/[id]

# Create admin page (protected)
leeforge-fusion generate page admin/posts
```

**Step 3: Implement Authentication**

```typescript
// src/middleware/auth.ts
import { requireAuth, requireAdmin } from "leeforge-fusion/middleware";

export const requireAuth = requireAuth();
export const requireAdmin = requireAdmin();
```

**Step 4: Configure Routes**

```typescript
// leeforge.config.ts
import { defineConfig } from "leeforge-fusion";
import { requireAuth, requireAdmin } from "./src/middleware/auth";

export default defineConfig({
  routes: {
    "/admin/*": [requireAuth(), requireAdmin()],
  },
});
```

**Step 5: Start Development**

```bash
leeforge-fusion dev
```

### Example 2: Creating a Dashboard with Authentication

**Step 1: Initialize Project**

```bash
leeforge-fusion init my-dashboard --template dashboard
```

**Step 2: Generate Pages**

```bash
leeforge-fusion generate page dashboard
leeforge-fusion generate page dashboard/settings
leeforge-fusion generate page login
```

**Step 3: Create API Routes**

```bash
leeforge-fusion generate api auth/login
leeforge-fusion generate api auth/logout
leeforge-fusion generate api users/[id]
```

**Step 4: Implement Middleware**

```typescript
// src/middleware/auth.ts
import { defineGuard, redirect } from "leeforge-fusion/middleware";

export const requireVerified = defineGuard((ctx) => {
  if (!ctx.user?.verified) {
    throw redirect("/verify-email");
  }
});
```

**Step 5: Build for Production**

```bash
leeforge-fusion build
```

### Example 3: Adding a New Feature to Existing App

**Step 1: Generate Page**

```bash
leeforge-fusion generate page features/[id]
```

**Step 2: Generate API Route**

```bash
leeforge-fusion generate api features/[id]
```

**Step 3: Generate Component**

```bash
leeforge-fusion generate component FeatureCard --test --css
```

**Step 4: Update Configuration**

```typescript
// leeforge.config.ts
import { defineConfig } from "leeforge-fusion";
import { requireAuth } from "leeforge-fusion/middleware";

export default defineConfig({
  routes: {
    "/features/*": [requireAuth()],
  },
});
```

**Step 5: Test**

```bash
npm test
leeforge-fusion dev
```

## Common Patterns & Best Practices

### Route Organization

- Use route groups `(dashboard)/` for organizing without affecting URL
- Keep related routes in the same directory
- Use dynamic routes `[id].tsx` for parameterized pages
- Create `layout.tsx` files for shared layouts

### Middleware

- Use built-in guards (`requireAuth`, `requireAdmin`, `requireGuest`) when possible
- Create custom guards with `defineGuard()` for specific requirements
- Chain guards with `createGuardChain()` for complex authorization
- Apply middleware in `leeforge.config.ts` for route protection

### Code Generation

- Use `--dry-run` to preview before creating files
- Use `--force` to overwrite existing files
- Generate TypeScript files by default
- Include tests with `--test` flag for components

### Development

- Use `leeforge-fusion dev` for development with HMR
- Check `leeforge.config.ts` for custom configuration
- Use `leeforge-fusion build` for production builds
- Run `npm test` before deploying

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Type checking
npm run typecheck
```

## Troubleshooting

### Common Issues

**Issue: Command not found**

```bash
# Solution: Install globally or use npx
npm install -g @leeforge/fusion-cli
# or
npx @leeforge/fusion-cli <command>
```

**Issue: Port already in use**

```bash
# Solution: Use different port
leeforge-fusion dev --port 3001
```

**Issue: Dev server won't start**

```bash
# Solution: Check if leeforge.config.ts exists
# Create one if missing:
cat > leeforge.config.ts << 'EOF'
import { defineConfig } from "leeforge-fusion";

export default defineConfig({
  api: {
    prefix: "/api",
  },
  vite: {
    server: {
      port: 3000,
    },
  },
});
EOF
```

**Issue: Build fails**

```bash
# Solution: Ensure src/app directory exists with page files
# Check structure:
ls -la src/app/
# Should have: layout.tsx, index.tsx, or page.tsx
```

**Issue: Generation fails**

```bash
# Solution: Use dry-run to debug
leeforge-fusion generate page test --dry-run
```

## References

### Package Structure

```
@leeforge/fusion-cli/
├── dist/                    # Built files
├── src/
│   ├── index.ts            # CLI entry point
│   ├── commands/
│   │   ├── init.ts         # Project initialization
│   │   ├── dev.ts          # Development server
│   │   ├── build.ts        # Production build
│   │   └── generate.ts     # Code generation
│   └── generators/
│       ├── page.ts         # Page generator
│       ├── api.ts          # API generator
│       └── component.ts    # Component generator
└── README.md
```

### Framework Exports

```typescript
// Main exports
import { defineConfig } from "leeforge-fusion";
import { createServerData } from "leeforge-fusion/data";
import { useServerAction } from "leeforge-fusion/client";

// Middleware exports
import {
  requireAuth,
  requireAdmin,
  requireGuest,
  createGuardChain,
  defineGuard,
  redirect,
} from "leeforge-fusion/middleware";

// API exports
import { apiFetch, withAuth, withJson } from "leeforge-fusion/data";
```

### Key Dependencies

- **Solid.js**: Reactive UI framework
- **TanStack Router**: Type-safe routing
- **TanStack Query**: Data fetching & caching
- **Hono**: High-performance middleware framework
- **Vite**: Next-gen build tool

## Resources

### scripts/

This skill includes utility scripts for common Leeforge Fusion tasks.

### references/

Detailed API documentation and usage examples.

### assets/

Templates and boilerplate code for common patterns.

---

**Ready to build?** Start with `leeforge-fusion init my-app` to create your first project!
