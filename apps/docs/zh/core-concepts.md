# Core Concepts

> Understand the fundamental concepts of Leeforge Fusion.

## 📁 File-Based Routing

Leeforge Fusion uses a file-based routing system. Routes are automatically generated from your `src/app/` directory structure.

### Route Mapping

| File Path                          | Route                 |
| ---------------------------------- | --------------------- |
| `src/app/index.tsx`                | `/`                   |
| `src/app/about.tsx`                | `/about`              |
| `src/app/blog/index.tsx`           | `/blog`               |
| `src/app/blog/[id].tsx`            | `/blog/:id`           |
| `src/app/blog/new.tsx`             | `/blog/new`           |
| `src/app/(dashboard)/settings.tsx` | `/dashboard/settings` |

### Dynamic Routes

Use square brackets for dynamic segments:

```tsx
// src/app/blog/[id].tsx
export default function BlogPost() {
  const { id } = useParams();
  return <div>Post ID: {id}</div>;
}
```

### Route Groups

Use parentheses for route groups (doesn't affect URL):

```tsx
// src/app/(dashboard)/settings.tsx
// URL: /dashboard/settings
```

## 🎨 Layouts

Layouts wrap child routes and provide shared UI.

### Root Layout

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

### Nested Layouts

```tsx
// src/app/blog/layout.tsx
export default function BlogLayout({ children }) {
  return (
    <div>
      <h1>Blog</h1>
      {children}
    </div>
  );
}
```

## 🚨 Error Boundaries

Error boundaries catch errors in child components.

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

## ⏳ Loading States

Loading components show while data is being fetched.

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

## 📊 Data Loading

### Server-Side Data Loading

```tsx
// src/app/blog/[id].tsx
import { createServerData } from "@leeforge/fusion/data";

export default function BlogPost() {
  const post = createServerData(async ({ params }) => {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    return res.json();
  });

  return (
    <div>
      <h1>{post().title}</h1>
      <p>{post().content}</p>
    </div>
  );
}
```

### Data Loader

```tsx
// src/app/blog/[id].tsx
export const loader = async ({ params, queryClient }) => {
  // Prefetch data before rendering
  const post = await fetchPost(params.id);
  return { post };
};

export default function BlogPost() {
  const { post } = useRouteData();
  return <div>{post.title}</div>;
}
```

## 🛡️ Middleware

Middleware runs before route handlers and can intercept requests.

### Creating Middleware

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
```

### Using Middleware

```tsx
// src/app/dashboard/guards.ts
import { requireAuth } from "@leeforge/fusion/middleware";

export const guards = {
  "/dashboard/*": [requireAuth()],
};
```

## 🔒 Route Guards

Route guards protect routes from unauthorized access.

### Global Guards

```typescript
// leeforge.config.ts
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  guards: {
    "/dashboard/*": "./src/middleware/auth.ts",
    "/admin/*": "./src/middleware/auth.ts",
  },
});
```

### Per-Route Guards

```tsx
// src/app/admin/guards.ts
import { requireAuth, requireAdmin } from "@leeforge/fusion/middleware";

export const guards = {
  "/admin/*": [requireAuth(), requireAdmin()],
};
```

## ⚡ Server Actions

Server actions allow you to call server-side functions from the client.

### Creating a Server Action

```tsx
// src/app/api/actions.ts
export async function createPost(data: { title: string; content: string }) {
  // Server-only code
  return { id: Date.now(), ...data };
}
```

### Using Server Actions

```tsx
// src/app/blog/new.tsx
import { useServerAction } from "@leeforge/fusion/client";
import { createPost } from "../api/actions";

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

## 🌐 API Routes

API routes provide server-side endpoints.

### Basic API Route

```tsx
// src/app/api/users/route.ts
export async function GET() {
  const users = await db.users.findAll();
  return Response.json(users);
}

export async function POST({ request }) {
  const data = await request.json();
  const user = await db.users.create(data);
  return Response.json(user, { status: 201 });
}
```

### Dynamic API Routes

```tsx
// src/app/api/users/[id]/route.ts
export async function GET({ params }) {
  const user = await db.users.findById(params.id);
  return Response.json(user);
}

export async function PUT({ request, params }) {
  const data = await request.json();
  const user = await db.users.update(params.id, data);
  return Response.json(user);
}

export async function DELETE({ params }) {
  await db.users.delete(params.id);
  return Response.json({ success: true });
}
```

## 📦 Configuration

### leeforge.config.ts

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

## 🎨 Styling

### CSS Modules

```tsx
// src/app/index.module.css
.container {
  padding: 2rem;
  background: #f5f5f5;
}

.title {
  color: #333;
  font-size: 2rem;
}
```

```tsx
// src/app/index.tsx
import styles from "./index.module.css";

export default function Home() {
  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Welcome</h1>
    </div>
  );
}
```

### Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
export default {
  content: ["./src/**/*.{tsx,ts,jsx,js}"],
  theme: { extend: {} },
  plugins: [],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
// src/app/layout.tsx
import "../index.css";

export default function Layout({ children }) {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <nav class="max-w-7xl mx-auto px-4 py-4">
          <a href="/" class="text-xl font-bold">
            My App
          </a>
        </nav>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

## 🔧 Environment Variables

### .env File

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App
```

### Accessing Variables

```tsx
// src/app/index.tsx
export default function Home() {
  const apiUrl = import.meta.env.VITE_API_URL;
  return <div>API: {apiUrl}</div>;
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

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Deploy

```bash
# Vercel
npm i -g vercel
vercel

# Netlify
npm i -g netlify
netlify deploy --prod
```

## 🎯 Best Practices

### 1. Keep Components Small

```tsx
// ✅ Good
export function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Bad
export function HugeComponent() {
  // 500 lines of code
}
```

### 2. Use Server Data Loading

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

### 3. Handle Errors

```tsx
// ✅ Good
export default function ErrorBoundary() {
  const error = useRouteError();
  return <div>Error: {error?.message}</div>;
}
```

### 4. Use Route Guards

```tsx
// ✅ Good
export const guards = [requireAuth()];
```

## 📚 Next Steps

- [CLI Reference](/cli) - All CLI commands
- [API Reference](/api) - Complete API documentation
- [Examples](/examples) - Real-world examples
