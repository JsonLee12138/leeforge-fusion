# Quick Start

> Get started with Leeforge Fusion in 5 minutes.

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install Dependencies

```bash
npm install @leeforge/fusion @leeforge/fusion-cli solid-js @tanstack/solid-router @tanstack/solid-query
```

## 🚀 Create Your First App

### Step 1: Create a New Project

```bash
# Create a new project with the basic template
npx leeforge init my-app

# Or with a specific template
npx leeforge init my-blog --template blog
npx leeforge init my-dashboard --template dashboard
```

### Step 2: Install Dependencies

```bash
cd my-app
npm install
```

### Step 3: Start Development

```bash
npm run dev
```

The server will start on `http://localhost:3000`. If port 3000 is in use, it will automatically try 3001, 3002, etc.

## 🎯 What You Get

### File-Based Routing

Create files in `src/app/` and they become routes:

```
src/app/
├── index.tsx       → /
├── about.tsx       → /about
├── blog/
│   ├── index.tsx   → /blog
│   ├── [id].tsx    → /blog/123
│   └── new.tsx     → /blog/new
```

### Automatic Layouts

The `layout.tsx` file wraps all pages:

```tsx
// src/app/layout.tsx
export default function Layout({ children }) {
  return (
    <div>
      <header>...</header>
      <main>{children}</main> {/* All pages render here */}
      <footer>...</footer>
    </div>
  );
}
```

### Error Boundaries

Create `error.tsx` for error handling:

```tsx
// src/app/error.tsx
export default function ErrorBoundary() {
  return <div>Something went wrong</div>;
}
```

### Loading States

Create `loading.tsx` for loading indicators:

```tsx
// src/app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

## 📝 Next Steps

### Add a Blog Page

```bash
mkdir -p src/app/blog
```

```tsx
// src/app/blog/index.tsx
export default function Blog() {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        <li>
          <a href="/blog/1">Post 1</a>
        </li>
        <li>
          <a href="/blog/2">Post 2</a>
        </li>
      </ul>
    </div>
  );
}
```

### Add a Dynamic Route

```tsx
// src/app/blog/[id].tsx
export default function BlogPost() {
  return (
    <div>
      <h1>Blog Post</h1>
      <p>This is a dynamic route!</p>
    </div>
  );
}
```

### Add an API Route

```bash
mkdir -p src/app/api/users
```

```tsx
// src/app/api/users/route.ts
export async function GET() {
  return Response.json({ users: ["Alice", "Bob"] });
}
```

### Add Middleware

```bash
mkdir -p src/middleware
```

```tsx
// src/middleware/auth.ts
import { createMiddleware } from "@leeforge/fusion/middleware";

export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await next();
});
```

### Protect Routes

```tsx
// src/app/dashboard/guards.ts
import { requireAuth } from "@leeforge/fusion/middleware";

export const guards = {
  "/dashboard/*": [requireAuth()],
};
```

## 🎨 Customization

### Add Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    extend: {},
  },
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

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm i -g netlify
netlify deploy --prod
```

## 📚 Learn More

- [Core Concepts](/core-concepts) - Understand the framework architecture
- [CLI Reference](/cli) - All CLI commands
- [API Reference](/api) - Complete API documentation
- [Examples](/examples) - Real-world examples

## 🎯 You're Ready!

You now have a working Leeforge Fusion app with:

- ✅ File-based routing
- ✅ Layouts and error boundaries
- ✅ API routes
- ✅ Middleware support
- ✅ Hot module replacement
- ✅ Auto port detection

**Happy coding!** 🚀
