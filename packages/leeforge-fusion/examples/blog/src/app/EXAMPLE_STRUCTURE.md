# 示例应用结构说明

由于 SolidJS 的 JSX 类型配置问题，这里提供完整的代码示例供参考。

## 完整代码示例

### 1. 布局 (layout.tsx)

```tsx
import { createSignal } from "solid-js";

export default function Layout(props: any) {
  const [count, setCount] = createSignal(0);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Leeforge Blog Example</title>
        <link rel="stylesheet" href="/index.css" />
      </head>
      <body>
        <nav className="navbar">
          <div className="nav-brand">
            <a href="/">Blog</a>
          </div>
          <div className="nav-links">
            <a href="/posts">Posts</a>
            <a href="/dashboard">Dashboard</a>
          </div>
        </nav>

        <main className="container">{props.children}</main>

        <footer className="footer">
          <p>Leeforge Fusion Example © 2026</p>
          <button onClick={() => setCount((c) => c + 1)}>
            Clicks: {count()}
          </button>
        </footer>
      </body>
    </html>
  );
}
```

### 2. 首页 (page.tsx)

```tsx
import { createSignal } from "solid-js";

export default function Home() {
  const [message, setMessage] = createSignal("Welcome to Leeforge Blog!");

  return (
    <div className="hero">
      <h1>{message()}</h1>
      <p>This is a blog example built with Leeforge Fusion.</p>
      <div className="actions">
        <a href="/posts" className="btn">
          View Posts
        </a>
        <a href="/dashboard" className="btn btn-primary">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
```

### 3. 文章列表 (posts/page.tsx)

```tsx
import { Route } from "./.framework/routes/posts/page";

export default function Posts() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="posts-page">
      <h1>All Posts</h1>
      <div className="post-list">
        {posts.map((post: any) => (
          <div className="post-card">
            <a href={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export const loader = async () => {
  // 模拟 API 调用
  const posts = [
    { id: 1, title: "First Post", excerpt: "This is the first post" },
    { id: 2, title: "Second Post", excerpt: "This is the second post" },
  ];
  return { posts };
};
```

### 4. 文章详情 (posts/[id]/page.tsx)

```tsx
import { Route } from "./.framework/routes/posts/$id";

export default function Post() {
  const { post } = Route.useLoaderData();

  return (
    <article className="post-detail">
      <h1>{post.title}</h1>
      <div className="content">{post.content}</div>
    </article>
  );
}

export const loader = async ({ params, context }) => {
  const post = await fetch(`${context.API_BASE}/posts/${params.id}`).then((r) =>
    r.json(),
  );
  return { post };
};
```

### 5. 仪表盘 (dashboard/page.tsx)

```tsx
import { Route } from "./.framework/routes/dashboard/page";
import { requireAuth } from "../middleware/auth";

export default function Dashboard() {
  const { user, stats } = Route.useLoaderData();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="user-info">
        <p>Welcome, {user.name}!</p>
        <p>Role: {user.role}</p>
      </div>
      <div className="stats">
        <p>Total Posts: {stats.totalPosts}</p>
        <p>Total Views: {stats.totalViews}</p>
      </div>
    </div>
  );
}

export const loader = async ({ context }) => {
  await requireAuth(context);

  const stats = {
    totalPosts: 42,
    totalViews: 1337,
  };

  return {
    user: context.user,
    stats,
  };
};
```

### 6. API 路由 (api/posts/route.ts)

```typescript
import { requireAuth } from "../../middleware/auth";

export async function GET() {
  const posts = [
    { id: 1, title: "Post 1", content: "Content 1" },
    { id: 2, title: "Post 2", content: "Content 2" },
  ];
  return Response.json(posts);
}

export async function POST(req: Request) {
  await requireAuth({
    user: { id: "123", role: "admin" },
    request: req,
  } as any);

  const data = await req.json();
  const newPost = {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
  };

  return Response.json(newPost, { status: 201 });
}

export async function DELETE(req: Request, { params }: any) {
  await requireAuth({
    user: { id: "123", role: "admin" },
    request: req,
  } as any);

  return Response.json({ success: true });
}
```

### 7. 中间件 (middleware/auth.ts)

```typescript
import { defineGuard, redirect } from "@leeforge/fusion";

export const requireAuth = defineGuard((ctx) => {
  if (!ctx.user) {
    throw redirect("/login");
  }
});

export const requireAdmin = defineGuard((ctx) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw redirect("/unauthorized");
  }
});
```

### 8. 中间件 (middleware/logger.ts)

```typescript
import { createMiddleware } from "hono/factory";

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  const path = c.req.path;

  await next();

  const duration = Date.now() - start;
  console.log(
    `[${new Date().toISOString()}] ${c.req.method} ${path} - ${c.res.status} (${duration}ms)`,
  );
});
```

### 9. 配置 (framework.config.ts)

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  routes: {
    base: "/",
    trailingSlash: "never",
    groups: {
      "(dashboard)": "/dashboard",
    },
    guards: {
      "/dashboard/*": "./src/middleware/auth.ts",
      "/api/posts/*": "./src/middleware/auth.ts",
    },
    ignore: ["**/*.spec.ts", "**/test/**", "**/node_modules/**"],
  },
});
```

### 10. 数据库模拟 (lib/db.ts)

```typescript
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "premium";
}

class Database {
  private posts: Post[] = [
    {
      id: 1,
      title: "Getting Started with Leeforge",
      content: "Leeforge is a powerful framework...",
      author: "John Doe",
      createdAt: "2026-01-15",
    },
    {
      id: 2,
      title: "Advanced Routing Patterns",
      content: "Learn how to use dynamic routes...",
      author: "Jane Smith",
      createdAt: "2026-01-16",
    },
  ];

  private users: User[] = [
    {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
    },
  ];

  async findPost(id: number): Promise<Post | undefined> {
    return this.posts.find((p) => p.id === id);
  }

  async findAllPosts(): Promise<Post[]> {
    return this.posts;
  }

  async createPost(data: Partial<Post>): Promise<Post> {
    const newPost: Post = {
      id: Date.now(),
      title: data.title || "Untitled",
      content: data.content || "",
      author: data.author || "Anonymous",
      createdAt: new Date().toISOString(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  async findUser(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }
}

export const db = new Database();
```

### 11. 客户端入口 (entry-client.tsx)

```tsx
/* @refresh reload */
import "./index.css";
import { hydrate } from "solid-js/web";
import App from "./App";

hydrate(() => <App />, document.getElementById("root") as HTMLElement);
```

### 12. 服务端入口 (entry-server.tsx)

```tsx
import { renderToString } from "solid-js/web";
import App from "./App";

export function render(_url: string) {
  const html = renderToString(() => <App />);
  return { html };
}
```

### 13. CSS 样式 (index.css)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  line-height: 1.6;
  color: #333;
}

.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links a {
  color: white;
  text-decoration: none;
  margin-left: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: #2980b9;
}

.btn:hover {
  opacity: 0.9;
}

.posts-page .post-list {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.post-card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-card a {
  text-decoration: none;
  color: inherit;
}

.post-card h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.post-card p {
  color: #666;
}

.post-detail article {
  max-width: 800px;
  margin: 0 auto;
}

.post-detail h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.post-detail .content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.dashboard h1 {
  margin-bottom: 2rem;
}

.user-info,
.stats {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.user-info p,
.stats p {
  margin: 0.5rem 0;
}

.footer {
  background: #34495e;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

.footer button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.container {
  min-height: calc(100vh - 200px);
}
```

## 使用步骤

1. **复制所有代码文件**到对应的目录
2. **安装依赖**：
   ```bash
   npm install
   ```
3. **生成路由**：
   ```bash
   npm run generate
   ```
4. **启动开发服务器**：
   ```bash
   npm run dev
   ```
5. **访问应用**：
   - 首页: http://localhost:3000
   - 文章列表: http://localhost:3000/posts
   - 文章详情: http://localhost:3000/posts/1
   - 仪表盘: http://localhost:3000/dashboard (需要登录)

## 功能演示

### 1. 路由扫描

```bash
# 查看生成的路由
npm run generate
# 输出:
# - / (首页)
# - /posts (文章列表)
# - /posts/:id (文章详情)
# - /dashboard (仪表盘)
# - /api/posts (API)
```

### 2. 中间件执行

```
请求 /dashboard
  ↓
loggerMiddleware (记录请求)
  ↓
authMiddleware (检查登录)
  ↓
loader (获取数据)
  ↓
渲染页面
```

### 3. 数据流

```
用户访问 /posts/1
  ↓
路由扫描器找到 posts/[id]/page.tsx
  ↓
执行 loader({ params: { id: "1" }, context })
  ↓
fetch('/api/posts/1')
  ↓
返回数据到组件
  ↓
SolidJS 渲染
  ↓
浏览器显示
```

## 扩展建议

### 添加新页面

1. 在 `app/` 下创建新目录
2. 添加 `page.tsx` 或 `page.server.tsx`
3. 运行 `npm run generate`

### 添加认证

1. 创建 `middleware/auth.ts`
2. 在 `framework.config.ts` 中配置守卫
3. 在 loader 中使用守卫

### 添加 API

1. 在 `app/api/` 下创建目录
2. 添加 `route.ts`
3. 实现 GET/POST/PUT/DELETE

---

**注意**: 这些示例代码需要配合 Leeforge Fusion 框架使用。确保已正确安装并配置框架。
