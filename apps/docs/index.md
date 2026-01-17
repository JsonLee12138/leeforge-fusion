---
layout: home

hero:
  name: "Leeforge Fusion"
  text: "A modern full-stack framework for Solid.js"
  tagline: File-based routing, middleware, server actions, and SSR - all in one framework
  actions:
    - theme: brand
      text: Get Started
      link: /quick-start
    - theme: alt
      text: View Examples
      link: /examples
    - theme: alt
      text: View on GitHub
      link: https://github.com/JsonLee12138/leeforge-fusion

features:
  - title: 🚀 File-Based Routing
    details: Automatic route generation from your file structure. No configuration needed.
  - title: 🔒 Middleware System
    details: Hono-based middleware for authentication, logging, CORS, and more.
  - title: ⚡ Server Actions
    details: Type-safe RPC between client and server. No manual API calls.
  - title: 🎨 SSR Ready
    details: Server-side rendering with seamless client hydration.
  - title: 🔧 Zero Config
    details: Works out of the box with sensible defaults. Customize when needed.
  - title: 📦 TypeScript First
    details: Full TypeScript support throughout. Type-safe by default.
---

# Leeforge Fusion Documentation

> A modern full-stack framework for Solid.js with file-based routing, middleware, and server actions.

## 🚀 Quick Start

### Installation

```bash
npm install @leeforge/fusion @leeforge/fusion-cli solid-js @tanstack/solid-router @tanstack/solid-query
```

### Create Your First App

```bash
# Create project structure
mkdir my-app && cd my-app
mkdir -p src/app src/middleware

# Create entry files
touch src/app/layout.tsx
touch src/app/index.tsx
touch framework.config.ts
touch vite.config.ts
```

### Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── index.tsx       # Home page (/)
│   │   ├── about.tsx       # About page (/about)
│   │   ├── blog/
│   │   │   ├── index.tsx   # Blog list (/blog)
│   │   │   ├── [id].tsx    # Blog post (/blog/123)
│   │   │   └── new.tsx     # New post (/blog/new)
│   │   └── api/
│   │       └── users/
│   │           └── route.ts # API endpoint
│   ├── middleware/
│   │   └── auth.ts         # Authentication middleware
│   └── entry-server.tsx    # Server entry (optional)
│
├── framework.config.ts      # Framework configuration
├── vite.config.ts           # Vite configuration
├── package.json
└── tsconfig.json
```

### Configuration

#### framework.config.ts

```typescript
import { defineConfig } from "@leeforge/fusion/config";
import { requireAuth, requireAdmin } from "@leeforge/fusion/middleware";

export default defineConfig({
  guards: {
    "/dashboard/*": [requireAuth()],
    "/admin/*": [requireAuth(), requireAdmin()],
  },
  api: {
    prefix: "/api",
  },
});
```

#### vite.config.ts

```typescript
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { leeforgePlugin } from "@leeforge/fusion/vite-plugin";

export default defineConfig({
  plugins: [solid(), leeforgePlugin()],
});
```

### Development

```bash
# Start development server
npx leeforge dev --port 3000

# The server will automatically find an available port
# if the specified port is in use
```

### Build & Preview

```bash
# Build for production
npx leeforge build

# Preview production build
npx leeforge preview
```

## 📚 Core Concepts

### File-Based Routing

Leeforge Fusion automatically generates routes from your `src/app/` directory:

| File                       | Route                 |
| -------------------------- | --------------------- |
| `index.tsx`                | `/`                   |
| `about.tsx`                | `/about`              |
| `blog/index.tsx`           | `/blog`               |
| `blog/[id].tsx`            | `/blog/:id`           |
| `blog/new.tsx`             | `/blog/new`           |
| `(dashboard)/settings.tsx` | `/dashboard/settings` |

### Route Files

#### Page Component

```tsx
// src/app/blog/[id].tsx
import { createSignal } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function BlogPost() {
  const [count, setCount] = createSignal(0);

  const post = createServerData(async ({ params }) => {
    // Fetch data on server
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    return res.json();
  });

  return (
    <div>
      <h1>{post().title}</h1>
      <p>{post().content}</p>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count()}</button>
    </div>
  );
}

// Optional: Data loader
export const loader = async ({ params, queryClient }) => {
  // Prefetch data before rendering
  return { post: await fetchPost(params.id) };
};

// Optional: Route guards
export const guards = [requireAuth()];
```

#### API Route

```tsx
// src/app/api/users/route.ts
export async function GET({ request, params }) {
  const users = await db.users.findAll();
  return Response.json(users);
}

export async function POST({ request, params }) {
  const data = await request.json();
  const user = await db.users.create(data);
  return Response.json(user, { status: 201 });
}

export async function PUT({ request, params }) {
  const data = await request.json();
  const user = await db.users.update(params.id, data);
  return Response.json(user);
}

export async function DELETE({ request, params }) {
  await db.users.delete(params.id);
  return Response.json({ success: true });
}
```

### Layouts

```tsx
// src/app/layout.tsx
import { JSX } from "solid-js";

export interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen">
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
        </nav>
      </header>
      <main>{props.children}</main>
      <footer>
        <p>© 2026 My App</p>
      </footer>
    </div>
  );
}
```

### Error Boundaries

```tsx
// src/app/error.tsx
import { useRouteError } from "@tanstack/solid-router";

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div class="error-page">
      <h1>Something went wrong</h1>
      <p>{error?.message || "Unknown error"}</p>
      <a href="/">Go back home</a>
    </div>
  );
}
```

### Loading States

```tsx
// src/app/loading.tsx
export default function Loading() {
  return (
    <div class="loading-page">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
```

### Middleware

```tsx
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
```

### Route Guards

```tsx
// src/app/admin/guards.ts
import { requireAuth, requireAdmin } from "@leeforge/fusion/middleware";

export const guards = {
  "/admin/*": [requireAuth(), requireAdmin()],
  "/dashboard/*": [requireAuth()],
};
```

### Server Actions

```tsx
// src/app/blog/new.tsx
import { useServerAction } from "@leeforge/fusion/client";

export async function createPost(data: { title: string; content: string }) {
  // Server-only code
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

## 🔧 CLI Commands

### `leeforge dev`

Start the development server.

```bash
leeforge dev --port 3000
```

**Options:**

- `--port <number>` - Port to listen on (default: 3000)
- The server will automatically find an available port if the specified one is in use

**Features:**

- Auto port detection
- Hot module replacement (HMR)
- Error overlay
- Route visualization

### `leeforge build`

Build the application for production.

```bash
leeforge build
```

**Output:**

- `dist/client/` - Client-side bundle
- `dist/server/` - Server-side bundle

### `leeforge generate`

Generate code scaffolding.

```bash
# Generate a page
leeforge generate page blog/[slug]

# Generate an API route
leeforge generate api users/[id]

# Generate a component
leeforge generate component Button

# Preview without creating files
leeforge generate page about --dry-run
```

## 🎨 Configuration

### framework.config.ts

```typescript
import { defineConfig } from "@leeforge/fusion/config";
import { requireAuth, requireAdmin } from "@leeforge/fusion/middleware";

export default defineConfig({
  // Route guards
  guards: {
    "/dashboard/*": [requireAuth()],
    "/admin/*": [requireAuth(), requireAdmin()],
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
});
```

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { leeforgePlugin } from "@leeforge/fusion/vite-plugin";

export default defineConfig({
  plugins: [solid(), leeforgePlugin()],
  server: {
    port: 3000,
  },
});
```

## 🛡️ Security

### Authentication

```typescript
// src/middleware/auth.ts
export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate token
  const user = await validateToken(token);
  ctx.set("user", user);

  await next();
});
```

### Authorization

```typescript
// src/middleware/auth.ts
export const requireAdmin = createMiddleware(async (ctx, next) => {
  const user = ctx.get("user");

  if (!user || user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await next();
});
```

### Input Validation

```typescript
// src/app/api/users/route.ts
export async function POST({ request }) {
  const data = await request.json();

  // Validate input
  if (!data.email || !data.password) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return Response.json({ error: "Invalid email format" }, { status: 400 });
  }

  // Create user
  const user = await db.users.create(data);
  return Response.json(user, { status: 201 });
}
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## 📦 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🎯 Best Practices

### 1. Keep Components Small

```tsx
// ✅ Good - Small, focused components
export function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Bad - Large, monolithic component
export function HugeComponent() {
  // 500 lines of code
}
```

### 2. Use Server Data Loading

```tsx
// ✅ Good - Server-side data loading
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

// ❌ Bad - Client-side data loading (slower)
export default function Blog() {
  const [posts, setPosts] = createSignal([]);

  onMount(async () => {
    const res = await fetchPosts();
    setPosts(res);
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

### 3. Use Route Guards

```tsx
// ✅ Good - Protected routes
export const guards = [requireAuth()];

// ❌ Bad - No protection
// No guards exported
```

### 4. Handle Errors Gracefully

```tsx
// ✅ Good - Error boundary
export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div>
      <h1>Error</h1>
      <p>{error?.message}</p>
    </div>
  );
}

// ❌ Bad - No error handling
export default function Page() {
  // No error handling
}
```

## 📚 API Reference

### Core Exports

#### `startDevServer(options)`

Start the development server.

```typescript
import { startDevServer } from "@leeforge/fusion";

await startDevServer({
  port: 3000,
  appDir: "src/app",
  rootDir: process.cwd(),
});
```

#### `RouteScanner`

Scan routes from directory.

```typescript
import { RouteScanner } from "@leeforge/fusion";

const scanner = new RouteScanner({ appDir: "src/app" });
const result = await scanner.scan();
```

#### `RouteGenerator`

Generate route files.

```typescript
import { RouteGenerator } from "@leeforge/fusion";

const generator = new RouteGenerator({ outputDir: ".generated" });
await generator.generate(routes);
```

#### `createMiddleware`

Create middleware.

```typescript
import { createMiddleware } from "@leeforge/fusion/middleware";

export const myMiddleware = createMiddleware(async (ctx, next) => {
  // Before
  await next();
  // After
});
```

#### `createServerData`

Create server-side data loader.

```typescript
import { createServerData } from "@leeforge/fusion/data";

const data = createServerData(async ({ params, queryClient }) => {
  return await fetchData(params.id);
});
```

#### `useServerAction`

Use server action on client.

```typescript
import { useServerAction } from "@leeforge/fusion/client";

const [action, { loading, error }] = useServerAction(myAction);
```

## 🎓 Examples

### Blog Application

See complete example in `apps/demo/`

### Todo Application

```tsx
// src/app/index.tsx
import { createSignal } from "solid-js";
import { useServerAction } from "@leeforge/fusion/client";

export async function addTodo(text: string) {
  return { id: Date.now(), text, completed: false };
}

export default function TodoApp() {
  const [todos, setTodos] = createSignal([]);
  const [add, { loading }] = useServerAction(addTodo);

  const handleAdd = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;

    const todo = await add(text);
    if (todo) {
      setTodos([...todos(), todo]);
      form.reset();
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <form onSubmit={handleAdd}>
        <input name="text" placeholder="Add todo..." />
        <button disabled={loading}>{loading ? "Adding..." : "Add"}</button>
      </form>
      <ul>
        {todos().map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Authentication Flow

```tsx
// src/middleware/auth.ts
export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await validateToken(token);
  ctx.set("user", user);

  await next();
});

// src/app/api/login/route.ts
export async function POST({ request }) {
  const { email, password } = await request.json();

  const user = await authenticate(email, password);

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = generateToken(user);

  return Response.json({ token, user });
}

// src/app/dashboard/page.tsx
import { useServerData } from "@leeforge/fusion/data";

export default function Dashboard() {
  const user = useServerData(async ({ context }) => {
    return context.user;
  });

  return (
    <div>
      <h1>Welcome, {user().name}</h1>
    </div>
  );
}
```

## 🚨 Troubleshooting

### Port Already in Use

The dev server automatically finds an available port:

```bash
$ leeforge dev --port 3000
⚠️  Port 3000 is in use, trying 3001...
🚀 Leeforge Dev Server running on http://localhost:3001
```

### Module Not Found

Make sure all dependencies are installed:

```bash
npm install @leeforge/fusion @leeforge/fusion-cli solid-js @tanstack/solid-router @tanstack/solid-query
```

### TypeScript Errors

Check your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 📞 Support

- **GitHub Issues**: https://github.com/JsonLee12138/leeforge-fusion/issues
- **Discussions**: https://github.com/JsonLee12138/leeforge-fusion/discussions
- **Documentation**: https://github.com/JsonLee12138/leeforge-fusion/tree/main/apps/docs

## 📄 License

MIT License - see [LICENSE](https://github.com/JsonLee12138/leeforge-fusion/blob/main/LICENSE) for details.

---

**Built with ❤️ using Leeforge Fusion**
