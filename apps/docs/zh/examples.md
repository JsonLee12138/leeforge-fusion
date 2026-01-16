# Examples

> Real-world examples and patterns for Leeforge Fusion.

## 📁 Project Structure

### Basic App

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── index.tsx
│   │   ├── about.tsx
│   │   ├── blog/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── new.tsx
│   │   └── api/
│   │       └── users/
│   │           └── route.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── entry-server.tsx
│
├── leeforge.config.ts
├── package.json
└── tsconfig.json
```

### Blog Application

```
blog-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── index.tsx
│   │   ├── about.tsx
│   │   ├── blog/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   ├── new.tsx
│   │   │   └── edit.tsx
│   │   ├── admin/
│   │   │   ├── index.tsx
│   │   │   ├── posts.tsx
│   │   │   ├── users.tsx
│   │   │   └── guards.ts
│   │   └── api/
│   │       ├── posts/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── users/
│   │           └── route.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── entry-server.tsx
│
├── leeforge.config.ts
├── package.json
└── tsconfig.json
```

## 🎨 Layout Examples

### Basic Layout

```tsx
// src/app/layout.tsx
import { JSX } from "solid-js";

export interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="text-xl font-bold text-gray-900">
                My App
              </a>
            </div>
            <div class="flex items-center space-x-4">
              <a href="/" class="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a href="/about" class="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="/blog" class="text-gray-600 hover:text-gray-900">
                Blog
              </a>
            </div>
          </div>
        </nav>
      </header>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {props.children}
      </main>
      <footer class="bg-white border-t mt-12">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p class="text-center text-gray-500 text-sm">© 2026 My App</p>
        </div>
      </footer>
    </div>
  );
}
```

### Dashboard Layout

```tsx
// src/app/dashboard/layout.tsx
import { JSX } from "solid-js";

export interface DashboardLayoutProps {
  children: JSX.Element;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <div class="min-h-screen bg-gray-100">
      <aside class="w-64 bg-white shadow fixed h-full">
        <nav class="p-4 space-y-2">
          <a
            href="/dashboard"
            class="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/posts"
            class="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Posts
          </a>
          <a
            href="/dashboard/users"
            class="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Users
          </a>
        </nav>
      </aside>
      <main class="ml-64 p-6">{props.children}</main>
    </div>
  );
}
```

## 📝 Page Examples

### Home Page

```tsx
// src/app/index.tsx
import { createSignal } from "solid-js";

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="space-y-6">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to My App</h1>
        <p class="text-xl text-gray-600">
          A modern full-stack framework for Solid.js
        </p>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Interactive Counter</h2>
        <div class="flex items-center justify-center space-x-4">
          <button
            onClick={() => setCount((c) => c - 1)}
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -
          </button>
          <span class="text-3xl font-mono">{count()}</span>
          <button
            onClick={() => setCount((c) => c + 1)}
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Quick Links</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/about"
            class="px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600"
          >
            About
          </a>
          <a
            href="/blog"
            class="px-4 py-2 bg-green-500 text-white rounded text-center hover:bg-green-600"
          >
            Blog
          </a>
          <a
            href="/dashboard"
            class="px-4 py-2 bg-purple-500 text-white rounded text-center hover:bg-purple-600"
          >
            Dashboard
          </a>
          <a
            href="/admin"
            class="px-4 py-2 bg-red-500 text-white rounded text-center hover:bg-red-600"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Blog List Page

```tsx
// src/app/blog/index.tsx
import { createServerData } from "@leeforge/fusion/data";

export default function BlogIndex() {
  const posts = createServerData(async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    return res.json();
  });

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>
        <p class="text-gray-600">
          Exploring Leeforge Fusion features and best practices
        </p>
      </div>

      <div class="space-y-4">
        {posts()
          .slice(0, 5)
          .map((post) => (
            <a
              href={`/blog/${post.id}`}
              class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p class="text-sm text-gray-500 truncate">{post.body}</p>
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Read →
                </span>
              </div>
            </a>
          ))}
      </div>

      <div class="bg-white shadow rounded-lg p-6 text-center">
        <a
          href="/blog/new"
          class="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
        >
          Create New Post
        </a>
      </div>
    </div>
  );
}
```

### Blog Post Page (Dynamic)

```tsx
// src/app/blog/[id].tsx
import { createServerData } from "@leeforge/fusion/data";

export default function BlogPost() {
  const post = createServerData(async ({ params }) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${params.id}`,
    );
    return res.json();
  });

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <a
          href="/blog"
          class="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to Blog
        </a>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{post().title}</h1>
        <p class="text-gray-600 whitespace-pre-wrap">{post().body}</p>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Comments</h2>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-sm text-gray-600 mb-2">Great post!</p>
            <p class="text-xs text-gray-500">By User • 2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### New Post Page (Server Actions)

```tsx
// src/app/blog/new.tsx
import { createSignal } from "solid-js";
import { useServerAction } from "@leeforge/fusion/client";

export async function createPost(data: { title: string; content: string }) {
  // Simulate API call
  return { id: Date.now(), ...data, createdAt: new Date().toISOString() };
}

export default function NewPost() {
  const [title, setTitle] = createSignal("");
  const [content, setContent] = createSignal("");
  const [create, { loading, error }] = useServerAction(createPost);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!title() || !content()) {
      alert("Please fill in all fields");
      return;
    }

    const result = await create({
      title: title(),
      content: content(),
    });

    if (result) {
      alert("Post created successfully!");
      setTitle("");
      setContent("");
    }
  };

  return (
    <div class="max-w-2xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content()}
              onInput={(e) => setContent(e.currentTarget.value)}
              rows={8}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your content here..."
              required
            />
          </div>

          {error && (
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error: {error.message}
            </div>
          )}

          <div class="flex justify-end space-x-3">
            <a
              href="/blog"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>

      {title() && (
        <div class="mt-6 bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-3">Preview</h2>
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{title()}</h3>
            <p class="text-gray-700 whitespace-pre-wrap">{content()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Dashboard Page (Protected)

```tsx
// src/app/dashboard/index.tsx
import { createServerData } from "@leeforge/fusion/data";

export default function Dashboard() {
  const stats = createServerData(async () => {
    return {
      totalUsers: 1234,
      activeSessions: 456,
      postsToday: 23,
      serverUptime: "99.9%",
    };
  });

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <div class="text-2xl font-bold text-gray-900">
            {stats().totalUsers}
          </div>
          <div class="text-gray-600 mt-1">Total Users</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
          <div class="text-2xl font-bold text-gray-900">
            {stats().activeSessions}
          </div>
          <div class="text-gray-600 mt-1">Active Sessions</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
          <div class="text-2xl font-bold text-gray-900">
            {stats().postsToday}
          </div>
          <div class="text-gray-600 mt-1">Posts Today</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-orange-500">
          <div class="text-2xl font-bold text-gray-900">
            {stats().serverUptime}
          </div>
          <div class="text-gray-600 mt-1">Server Uptime</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center border-b pb-2">
              <span>New user registration</span>
              <span class="text-sm text-gray-500">2 min ago</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2">
              <span>Post published</span>
              <span class="text-sm text-gray-500">15 min ago</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2">
              <span>Server backup completed</span>
              <span class="text-sm text-gray-500">1 hour ago</span>
            </div>
            <div class="flex justify-between items-center">
              <span>System update installed</span>
              <span class="text-sm text-gray-500">3 hours ago</span>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <a
              href="/blog/new"
              class="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
            >
              Create New Post
            </a>
            <a
              href="/admin/users"
              class="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
            >
              Manage Users
            </a>
            <a
              href="/admin/settings"
              class="block w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center"
            >
              System Settings
            </a>
            <button class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Admin Panel (Protected)

```tsx
// src/app/admin/index.tsx
export default function Admin() {
  const data = {
    users: 1234,
    posts: 567,
    reports: 12,
    pending: 5,
  };

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6 border-l-4 border-red-500">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p class="text-gray-600">Administrator access required</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-red-600">
            User Management
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Total Users</span>
              <span class="font-bold">{data.users}</span>
            </div>
            <div class="flex justify-between">
              <span>Pending Approvals</span>
              <span class="font-bold text-orange-500">{data.pending}</span>
            </div>
            <button class="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Manage Users
            </button>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-red-600">
            Content Moderation
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Total Posts</span>
              <span class="font-bold">{data.posts}</span>
            </div>
            <div class="flex justify-between">
              <span>Reports</span>
              <span class="font-bold text-orange-500">{data.reports}</span>
            </div>
            <button class="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Review Reports
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-red-600">System Controls</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Backup DB
          </button>
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Clear Logs
          </button>
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Restart API
          </button>
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            View Metrics
          </button>
        </div>
      </div>

      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 class="font-semibold text-red-800 mb-2">⚠️ Restricted Area</h3>
        <p class="text-red-700 text-sm">
          You are viewing the admin panel. All actions are logged and monitored.
          Ensure you have proper authorization before making changes.
        </p>
      </div>
    </div>
  );
}
```

## 🔒 Authentication Examples

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

async function validateToken(token: string) {
  // Validate token and return user
  return { id: "1", role: "admin", name: "Admin User" };
}
```

### Route Guards

```tsx
// src/app/dashboard/guards.ts
import { requireAuth } from "@leeforge/fusion/middleware";

export const guards = {
  "/dashboard/*": [requireAuth()],
};
```

### Login API

```tsx
// src/app/api/login/route.ts
export async function POST({ request }) {
  const { email, password } = await request.json();

  // Validate credentials
  const user = await authenticate(email, password);

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate token
  const token = generateToken(user);

  return Response.json({ token, user });
}
```

### Protected Page

```tsx
// src/app/dashboard/index.tsx
import { createServerData } from "@leeforge/fusion/data";

export default function Dashboard() {
  const user = createServerData(async ({ context }) => {
    return context.user;
  });

  return (
    <div>
      <h1>Welcome, {user().name}</h1>
      <p>Role: {user().role}</p>
    </div>
  );
}
```

## 🌐 API Examples

### CRUD API

```tsx
// src/app/api/posts/route.ts
export async function GET() {
  const posts = await db.posts.findAll();
  return Response.json(posts);
}

export async function POST({ request }) {
  const data = await request.json();
  const post = await db.posts.create(data);
  return Response.json(post, { status: 201 });
}
```

```tsx
// src/app/api/posts/[id]/route.ts
export async function GET({ params }) {
  const post = await db.posts.findById(params.id);
  return Response.json(post);
}

export async function PUT({ request, params }) {
  const data = await request.json();
  const post = await db.posts.update(params.id, data);
  return Response.json(post);
}

export async function DELETE({ params }) {
  await db.posts.delete(params.id);
  return Response.json({ success: true });
}
```

### Validation

```tsx
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

## 🎨 Styling Examples

### CSS Modules

```tsx
// src/app/index.module.css
.container {
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.title {
  color: #333;
  font-size: 2rem;
  font-weight: bold;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin-top: 0.5rem;
}
```

```tsx
// src/app/index.tsx
import styles from "./index.module.css";

export default function Home() {
  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Welcome</h1>
      <p class={styles.subtitle}>This is a styled component</p>
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
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
      },
    },
  },
  plugins: [],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }

  .card {
    @apply bg-white shadow rounded-lg p-6;
  }
}
```

```tsx
// src/app/layout.tsx
import "../index.css";

export default function Layout({ children }) {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <nav class="max-w-7xl mx-auto px-4 py-4">
          <a href="/" class="text-xl font-bold text-gray-900">
            My App
          </a>
        </nav>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

## 🧪 Testing Examples

### Unit Tests

```tsx
// src/app/index.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import Home from "./index";

describe("Home", () => {
  it("renders welcome message", () => {
    render(() => <Home />);
    expect(screen.getByText("Welcome to My App")).toBeInTheDocument();
  });
});
```

### Integration Tests

```tsx
// tests/integration/app.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import App from "../src/app";

describe("App Integration", () => {
  it("navigates between pages", async () => {
    render(() => <App />);

    // Click on About link
    const aboutLink = screen.getByText("About");
    fireEvent.click(aboutLink);

    // Should show About page
    expect(await screen.findByText("About Page")).toBeInTheDocument();
  });
});
```

### E2E Tests

```tsx
// tests/e2e/basic-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Basic Flow", () => {
  test("user can navigate and interact", async ({ page }) => {
    // Go to home
    await page.goto("http://localhost:3000");
    await expect(page).toHaveTitle(/Home/);

    // Navigate to about
    await page.click("text=About");
    await expect(page).toHaveTitle(/About/);

    // Navigate to blog
    await page.click("text=Blog");
    await expect(page).toHaveTitle(/Blog/);

    // Navigate to blog post
    await page.click("text=Read →");
    await expect(page).toHaveTitle(/Blog Post/);
  });
});
```

## 🚀 Deployment Examples

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

```bash
# Build and run
docker build -t my-app .
docker run -p 3000:3000 my-app
```

## 📚 More Examples

### Todo App

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
    <div class="max-w-md mx-auto space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-4">Todo App</h1>

        <form onSubmit={handleAdd} class="flex gap-2 mb-4">
          <input
            name="text"
            placeholder="Add todo..."
            class="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        <ul class="space-y-2">
          {todos().map((todo) => (
            <li
              key={todo.id}
              class="flex items-center gap-2 p-2 bg-gray-50 rounded"
            >
              <input type="checkbox" checked={todo.completed} />
              <span class={todo.completed ? "line-through text-gray-500" : ""}>
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### Search with Debounce

```tsx
// src/app/search.tsx
import { createSignal, createEffect } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function Search() {
  const [query, setQuery] = createSignal("");
  const [debounced, setDebounced] = createSignal("");

  // Debounce the query
  createEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(query());
    }, 300);
    return () => clearTimeout(timeout);
  });

  const results = createServerData(async () => {
    if (!debounced()) return [];

    const res = await fetch(
      `https://api.example.com/search?q=${encodeURIComponent(debounced())}`,
    );
    return res.json();
  });

  return (
    <div class="max-w-2xl mx-auto space-y-4">
      <div class="bg-white shadow rounded-lg p-6">
        <input
          type="text"
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {debounced() && (
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold mb-4">
            Results for "{debounced()}"
          </h2>
          <ul class="space-y-2">
            {results().map((result) => (
              <li key={result.id} class="p-2 hover:bg-gray-50 rounded">
                {result.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
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
```

### 3. Handle Errors

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
```

### 4. Use Route Guards

```tsx
// ✅ Good - Protected routes
export const guards = [requireAuth()];
```

### 5. Validate Input

```tsx
// ✅ Good - Input validation
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
- [API Reference](/api) - Complete API documentation
