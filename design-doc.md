# 设计文档：基于 Vite SSR + SolidJS + Hono 的 Next.js 替代框架

## 项目概述

### 目标

创建一个功能完备的 React/Next.js 替代框架，使用现代技术栈：

- **SolidJS** - 高性能响应式 UI 框架
- **Vite SSR** - 快速的开发体验和构建
- **Hono** - 轻量级高性能 Web 框架
- **Bun** - 超快的运行时和包管理器

### 核心特性

1. ✅ 文件系统路由（App Router）
2. ✅ 服务端渲染 (SSR)
3. ✅ 静态站点生成 (SSG)
4. ✅ API 路由
5. ✅ 服务端组件
6. ✅ 客户端组件水合
7. ✅ 数据获取
8. ✅ 中间件支持
9. ✅ TypeScript 支持
10. ✅ 开发服务器热重载

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Bun Runtime                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   Hono Server    │  │   Vite Build     │                │
│  │  (API Routes)    │  │  (Client/SSR)    │                │
│  └──────────────────┘  └──────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  TanStack Router │  │  SolidJS Runtime │                │
│  │  (File-based)    │  │  (Hydration)     │                │
│  └──────────────────┘  └──────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  TanStack Query  │  │  Data Layer      │                │
│  │  (Caching)       │  │  (SSR/CSR)       │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 数据流架构

```
┌─────────────────────────────────────────────────────────────┐
│                    混合数据获取模式                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  前端路由层 (TanStack Router)                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • File-based routing                                │   │
│  │ • Loader functions (SSR/CSR)                        │   │
│  │ • beforeLoad (guards/transformation)                │   │
│  │ • Search params state management                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  服务端 API 层 (Next.js 模式)                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • app/api/* - RESTful endpoints                     │   │
│  │ • app/(route)/route.ts - Route-level API            │   │
│  │ • Server Actions (use server)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  数据层 (TanStack Query)                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Client-side caching                               │   │
│  │ • SSR state hydration                               │   │
│  │ • Optimistic updates                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
my-app/
├── src/
│   ├── app/                    # App Router (TanStack Router)
│   │   ├── layout.tsx          # 根布局组件
│   │   ├── page.tsx            # 首页 (带 loader)
│   │   ├── api/                # API 路由 (Hono)
│   │   │   ├── route.ts
│   │   │   ├── posts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── (dashboard)/        # 路由组
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # 带 loader
│   │   │   └── actions.ts      # Server Actions
│   │   ├── posts/              # 动态路由
│   │   │   ├── page.tsx        # 列表页
│   │   │   └── [postId]/
│   │   │       ├── page.tsx    # 详情页 (带 loader)
│   │   │       └── page.server.tsx  # 服务端组件
│   │   └── not-found.tsx       # 404 页面
│   ├── components/             # 共享组件
│   │   ├── ui/                 # UI 组件
│   │   └── PostCard.tsx        # 业务组件
│   ├── lib/                    # 工具函数
│   │   ├── db.ts               # 数据库
│   │   ├── auth.ts             # 认证
│   │   └── utils.ts
│   ├── types/                  # TypeScript 类型
│   │   └── index.ts
│   └── client/                 # 客户端入口
│       └── entry.tsx
├── public/                     # 静态资源
├── config/
│   ├── vite.config.ts          # Vite 配置
│   ├── tsconfig.json           # TypeScript 配置
│   └── leeforge.config.ts      # 框架配置
├── package.json
└── bun.lockb
```

## 核心模块设计

### 1. 路由系统 (TanStack Router 集成)

#### 路由约定

- `page.tsx` - 页面组件 + TanStack Route 定义
- `page.server.tsx` - 服务端组件 (SSR 专用)
- `layout.tsx` - 布局组件 + Root Route
- `route.ts` - API 路由 (Hono)
- `actions.ts` - Server Actions (use server)

#### 文件路由映射

```typescript
// 框架内部转换
// app/posts/page.tsx → TanStack Route: /posts
// app/posts/[postId]/page.tsx → TanStack Route: /posts/$postId
// app/(dashboard)/page.tsx → TanStack Route: /dashboard (路由组)
```

#### 路由生成器

```typescript
// 内部实现
import { createFileRoute } from "@tanstack/solid-router";

class RouteGenerator {
  constructor(appDir: string);

  // 扫描 app 目录生成路由树
  async generateRouteTree(): Promise<RouteTree> {
    const files = await this.scanAppDirectory();
    return this.buildRouteTree(files);
  }

  // 生成客户端路由文件
  async generateClientRoutes(): Promise<string> {
    // 为每个 page.tsx 生成对应的 TanStack Route
  }

  // 生成 API 路由注册
  async generateAPIRoutes(): Promise<string> {
    // 扫描 app/api 目录，生成 Hono 路由
  }
}
```

#### 路由配置示例

```typescript
// app/posts/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/posts')({
  // Loader - 支持 SSR 和 CSR
  loader: async ({ context }) => {
    const posts = await context.queryClient.fetchQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts`)
        return res.json()
      }
    })
    return { posts }
  },

  // 组件
  component: PostsPage
})

function PostsPage() {
  const { posts } = Route.useLoaderData()

  return (
    <div>
      <h1>Posts</h1>
      <For each={posts}>
        {(post) => (
          <Route.Link to="/posts/$postId" params={{ postId: post.id }}>
            {post.title}
          </Route.Link>
        )}
      </For>
    </div>
  )
}
```

#### 动态路由

```typescript
// app/posts/[postId]/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.fetchQuery({
      queryKey: ['post', params.postId],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts/${params.postId}`)
        if (!res.ok) throw new Error('Post not found')
        return res.json()
      }
    })
    return { post }
  },

  errorComponent: ({ error }) => {
    return <NotFound message={error.message} />
  },

  component: PostDetailPage
})

function PostDetailPage() {
  const { post } = Route.useLoaderData()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

#### 路由组和布局

```typescript
// app/(dashboard)/layout.tsx
import { createFileRoute, Outlet } from '@tanstack/solid-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout
})

function DashboardLayout() {
  return (
    <div class="dashboard-layout">
      <aside>
        <nav>
          <Route.Link to="/dashboard">Overview</Route.Link>
          <Route.Link to="/dashboard/posts">Posts</Route.Link>
          <Route.Link to="/dashboard/users">Users</Route.Link>
        </nav>
      </aside>
      <main>
        <Outlet /> {/* 嵌套子路由 */}
      </main>
    </div>
  )
}

// app/(dashboard)/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    const stats = await fetch(`${context.API_BASE}/api/dashboard/stats`)
      .then(r => r.json())
    return { stats }
  },

  component: DashboardOverview
})

function DashboardOverview() {
  const { stats } = Route.useLoaderData()
  return <div>Stats: {stats.userCount}</div>
}
```

### 2. 服务端渲染流程

```
请求 → Hono 路由 → 路由匹配 → TanStack Router → Loader 执行 → SSR → 水合 → 响应
```

#### 渲染管道

```typescript
// server/renderer.ts
import { createMemoryHistory, createRouter } from "@tanstack/solid-router";
import { renderToStringAsync } from "solid-js/web";

export class SSRRenderer {
  async render(url: string, context: AppContext): Promise<SSRResult> {
    // 1. 创建内存历史记录
    const history = createMemoryHistory({ initialEntries: [url] });

    // 2. 创建 TanStack Router 实例
    const router = createRouter({
      history,
      routeTree: await this.loadRouteTree(),
      context: {
        queryClient: context.queryClient,
        user: context.user,
        API_BASE: context.API_BASE,
      },
    });

    // 3. 执行路由 loader (在服务端)
    await router.load();

    // 4. 执行中间件
    await this.runMiddleware(router, context);

    // 5. 服务端渲染
    const html = await renderToStringAsync(() => router.RootComponent);

    // 6. 注入状态
    const dehydratedState = JSON.stringify(context.queryClient.dehydrate());

    const hydrated = this.injectState(html, {
      dehydratedState,
      routerState: router.state,
    });

    return {
      html: hydrated,
      status: 200,
      headers: {},
    };
  }
}
```

#### 客户端水合

```typescript
// client/entry.tsx
import { hydrate } from 'solid-js/web'
import { createRouter, createMemoryHistory } from '@tanstack/solid-router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'

// 从服务端获取状态
const dehydratedState = window.__DEHYDRATED_STATE__
const routerState = window.__ROUTER_STATE__

// 创建 QueryClient 并恢复状态
const queryClient = new QueryClient()
queryClient.hydrate(dehydratedState)

// 创建 Router
const router = createRouter({
  history: createMemoryHistory({ initialEntries: [window.location.pathname] }),
  routeTree: window.__ROUTE_TREE__,
  context: {
    queryClient,
    user: window.__USER__,
    API_BASE: window.__API_BASE__
  }
})

// 恢复路由状态
router.hydrate(routerState)

// 水合
hydrate(() => {
  return (
    <QueryClientProvider client={queryClient}>
      {router.RootComponent}
    </QueryClientProvider>
  )
}, document.getElementById('root')!)
```

### 3. 服务端组件支持

#### 服务端组件模式

```typescript
// app/dashboard/page.server.tsx
// 纯服务端渲染，不水合

import { createServerFn } from 'your-framework/server'

// 服务端数据函数
const getDashboardData = createServerFn(async () => {
  const [posts, users, stats] = await Promise.all([
    db.posts.findAll({ limit: 10 }),
    db.users.findAll({ limit: 5 }),
    db.getStats()
  ])

  return { posts, users, stats }
})

// 服务端组件
export default async function DashboardServerPage() {
  const data = await getDashboardData()

  return (
    <div class="dashboard">
      <h1>Dashboard</h1>

      <section>
        <h2>Recent Posts</h2>
        <ul>
          {data.posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>User Stats</h2>
        <p>Total Users: {data.users.length}</p>
        <p>Total Posts: {stats.postCount}</p>
      </section>
    </div>
  )
}
```

#### 混合组件模式

```typescript
// app/posts/[postId]/page.tsx
import { createFileRoute } from '@tanstack/solid-router'
import { PostComments } from './PostComments' // 客户端组件

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    // 数据获取
    const post = await context.queryClient.fetchQuery({
      queryKey: ['post', params.postId],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts/${params.postId}`)
        return res.json()
      }
    })

    return { post }
  },

  component: PostPage
})

function PostPage() {
  const { post } = Route.useLoaderData()

  return (
    <article>
      {/* 服务端渲染内容 */}
      <h1>{post.title}</h1>
      <time>{new Date(post.createdAt).toLocaleDateString()}</time>
      <div innerHTML={post.content} />

      {/* 客户端交互组件 */}
      <PostComments postId={post.id} />
    </article>
  )
}

// PostComments.tsx - 客户端组件
import { createQuery } from '@tanstack/solid-query'

export function PostComments({ postId }: { postId: string }) {
  const commentsQuery = createQuery(() => ({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${postId}/comments`)
      return res.json()
    }
  }))

  return (
    <div class="comments">
      <h3>Comments</h3>
      <Show when={commentsQuery.data}>
        <For each={commentsQuery.data}>
          {(comment) => (
            <div class="comment">
              <strong>{comment.author}</strong>
              <p>{comment.content}</p>
            </div>
          )}
        </For>
      </Show>
    </div>
  )
}
```

#### 客户端水合流程

```typescript
// client/entry.tsx
import { hydrate } from 'solid-js/web'
import { createRouter, createMemoryHistory } from '@tanstack/solid-router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'

// 从服务端注入的状态
const dehydratedState = window.__DEHYDRATED_STATE__
const routerState = window.__ROUTER_STATE__
const user = window.__USER__

// 创建 QueryClient 并恢复状态
const queryClient = new QueryClient()
queryClient.hydrate(dehydratedState)

// 创建 Router
const router = createRouter({
  history: createMemoryHistory({ initialEntries: [window.location.pathname] }),
  routeTree: window.__ROUTE_TREE__,
  context: {
    queryClient,
    user,
    API_BASE: window.__API_BASE__
  }
})

// 恢复路由状态
router.hydrate(routerState)

// 水合应用
hydrate(() => {
  return (
    <QueryClientProvider client={queryClient}>
      {router.RootComponent}
    </QueryClientProvider>
  )
}, document.getElementById('root')!)
```

#### 客户端水合

```typescript
// 客户端入口
import { hydrate } from "solid-js/web";
import { createFromManifest } from "./ssr-manifest";

const manifest = window.__SSR_MANIFEST__;
const app = createFromManifest(manifest);

hydrate(() => app, document.getElementById("root")!);
```

### 4. API 路由系统 (Hono 集成)

#### RESTful API 路由

```typescript
// app/api/posts/route.ts
import { Hono } from "hono";

const app = new Hono();

// GET /api/posts - 获取所有文章
app.get(async (c) => {
  const posts = await db.posts.findAll({
    orderBy: { createdAt: "desc" },
  });
  return c.json(posts);
});

// POST /api/posts - 创建文章
app.post(async (c) => {
  const body = await c.req.json();
  const post = await db.posts.create({
    title: body.title,
    content: body.content,
    excerpt: body.content.substring(0, 200),
  });
  return c.json(post, { status: 201 });
});

export default app;

// app/api/posts/[id]/route.ts
import { Hono } from "hono";

const app = new Hono();

// GET /api/posts/123 - 获取单篇文章
app.get(async (c) => {
  const { id } = c.req.param();
  const post = await db.posts.findById(id);
  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }
  return c.json(post);
});

// PUT /api/posts/123 - 更新文章
app.put(async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const post = await db.posts.update(id, body);
  return c.json(post);
});

// DELETE /api/posts/123 - 删除文章
app.delete(async (c) => {
  const { id } = c.req.param();
  await db.posts.delete(id);
  return c.json({ success: true });
});

export default app;

// app/api/users/[userId]/posts/route.ts
import { Hono } from "hono";

const app = new Hono();

// GET /api/users/123/posts - 获取用户的所有文章
app.get(async (c) => {
  const { userId } = c.req.param();
  const posts = await db.posts.findByUserId(userId);
  return c.json(posts);
});

export default app;
```

#### 带查询参数的 API

```typescript
// app/api/search/route.ts
import { Hono } from "hono";

const app = new Hono();

app.get(async (c) => {
  const query = c.req.query("q"); // 搜索关键词
  const limit = parseInt(c.req.query("limit") || "10");
  const offset = parseInt(c.req.query("offset") || "0");

  const results = await db.search({
    query,
    limit,
    offset,
  });

  return c.json({
    results,
    total: results.length,
    hasMore: results.length === limit,
  });
});

export default app;
```

#### 中间件和错误处理

```typescript
// app/api/posts/route.ts
import { Hono } from "hono";
import { authMiddleware } from "@/lib/auth";

const app = new Hono();

// 应用级中间件
app.use("*", async (c, next) => {
  console.log(`[API] ${c.req.method} ${c.req.url}`);
  await next();
});

// 认证中间件
app.use("/posts/*", authMiddleware);

// 错误处理
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

app.get(async (c) => {
  const posts = await db.posts.findAll();
  return c.json(posts);
});

app.post(async (c) => {
  const body = await c.req.json();

  // 验证
  if (!body.title || !body.content) {
    return c.json({ error: "Title and content required" }, 400);
  }

  const post = await db.posts.create(body);
  return c.json(post, { status: 201 });
});

export default app;
```

#### 自动路由注册

```typescript
// framework/internal/api-router.ts
import { Hono } from "hono";
import { glob } from "glob";

export async function registerAPIRoutes(app: Hono, apiDir: string) {
  // 扫描所有 route.ts 文件
  const routeFiles = await glob(`${apiDir}/**/route.ts`);

  for (const file of routeFiles) {
    // 计算路由路径
    const routePath = file
      .replace(apiDir, "")
      .replace("/route.ts", "")
      .replace(/\[([^\]]+)\]/g, ":$1"); // [id] → :id

    // 动态导入路由模块
    const routeModule = await import(file);
    const routeApp = routeModule.default;

    // 注册到主应用
    app.route(routePath, routeApp);
  }
}

// 使用示例
const apiApp = new Hono();
await registerAPIRoutes(apiApp, "./app/api");

const mainApp = new Hono();
mainApp.route("/api", apiApp);
```

#### 自动路由注册

```typescript
// 自动扫描 app/api 目录
function registerAPIRoutes(app: Hono, apiDir: string) {
  const routes = scanAPIRoutes(apiDir);

  for (const route of routes) {
    const handler = route.handler;

    // 支持所有 HTTP 方法
    if (handler.get) app.get(route.path, handler.get);
    if (handler.post) app.post(route.path, handler.post);
    if (handler.put) app.put(route.path, handler.put);
    if (handler.delete) app.delete(route.path, handler.delete);
    if (handler.patch) app.patch(route.path, handler.patch);
  }
}
```

### 5. 中间件系统

#### Hono 中间件 (API 路由)

```typescript
// lib/middleware/auth.ts
import { createMiddleware } from "hono/factory";

// 认证中间件
export const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const user = await verifyToken(token);
    c.set("user", user);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

// 权限中间件
export const requirePermission = (permission: string) => {
  return createMiddleware(async (c, next) => {
    const user = c.get("user");

    if (!user || !user.permissions.includes(permission)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  });
};

// 日志中间件
export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  console.log(
    `[${c.req.method}] ${c.req.url} - ${c.res.status} (${duration}ms)`,
  );
});
```

#### TanStack Router 中间件 (页面路由)

```typescript
// app/middleware.ts
import { redirect } from "@tanstack/solid-router";

// 全局路由守卫
export const beforeLoad = async ({ context, location }) => {
  // 认证检查
  if (location.pathname.startsWith("/admin") && !context.user) {
    throw redirect({ to: "/login" });
  }

  // 权限检查
  if (location.pathname.startsWith("/admin")) {
    const hasPermission = await checkPermission(context.user.id, "admin");
    if (!hasPermission) {
      throw redirect({ to: "/unauthorized" });
    }
  }

  // 返回增强的上下文
  return {
    ...context,
    timestamp: Date.now(),
  };
};

// 路由组中间件
// app/(dashboard)/layout.tsx
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    // 仅应用于 /dashboard/* 路由
    if (!context.user) {
      throw redirect({ to: "/login" });
    }

    return {
      ...context,
      dashboardPermissions: await getDashboardPermissions(context.user.id),
    };
  },

  component: DashboardLayout,
});
```

#### 服务端组件中间件

```typescript
// app/admin/page.server.tsx
import { defineServerMiddleware } from 'your-framework/server'

export const middleware = defineServerMiddleware(async (context) => {
  // 纯服务端中间件
  const user = await authenticateServer(context)

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return { user }
})

export default async function AdminPage({ user }) {
  // 只有认证通过才会执行到这里
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user.name}</p>
    </div>
  )
}
```

#### 组合中间件

```typescript
// lib/middleware/compose.ts
import { createMiddleware } from "hono/factory";

export function composeMiddleware(...middlewares: any[]) {
  return createMiddleware(async (c, next) => {
    for (const middleware of middlewares) {
      await middleware(c, async () => {});
    }
    await next();
  });
}

// 使用
import { authMiddleware, loggerMiddleware } from "@/lib/middleware";

const protectedRoutes = composeMiddleware(loggerMiddleware, authMiddleware);

// app/api/protected/route.ts
import { Hono } from "hono";
import { protectedRoutes } from "@/lib/middleware";

const app = new Hono();

app.use("*", protectedRoutes);

app.get(async (c) => {
  const user = c.get("user");
  return c.json({ message: `Hello ${user.name}` });
});

export default app;
```

#### 路由组中间件

```typescript
// app/(dashboard)/layout.tsx
export const middleware = defineMiddleware(async (context) => {
  // 仅应用于 /dashboard/* 路由
  await checkPermissions(context);
});
```

### 6. 数据获取系统

#### 混合数据获取架构

我们的框架结合了 **TanStack Router** 的 `loader` 模式和 **Next.js** 的 API 路由模式，提供完整的前后端数据流：

```
┌─────────────────────────────────────────────────────────┐
│                    数据流架构                            │
├─────────────────────────────────────────────────────────┤
│  前端路由 (TanStack Router)                             │
│  ├─ loader: 服务端预取数据 (SSR/SSG)                    │
│  ├─ beforeLoad: 路由守卫/数据转换                       │
│  └─ searchParams: URL 状态管理                          │
│                                                         │
│  后端 API (Next.js 模式)                                │
│  ├─ app/api/* - RESTful API 端点                       │
│  ├─ app/(route)/route.ts - 路由级 API                   │
│  └─ Server Actions - 服务端动作                         │
└─────────────────────────────────────────────────────────┘
```

#### 6.1 路由级 Loader (TanStack 模式)

```typescript
// app/posts/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

// 定义路由
export const Route = createFileRoute('/posts')({
  // Loader - 在服务端和客户端都会执行
  loader: async ({ context, location }) => {
    // SSR 时：在服务端执行，数据注入到页面
    // 客户端导航：在浏览器执行，支持缓存

    const posts = await context.queryClient.fetchQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts`)
        return res.json()
      }
    })

    return { posts }
  },

  // beforeLoad - 路由守卫、数据转换
  beforeLoad: async ({ context, location }) => {
    // 认证检查
    if (!context.user) {
      throw redirect({ to: '/login' })
    }

    // 数据预处理
    return {
      user: context.user,
      permissions: await getPermissions(context.user.id)
    }
  },

  // 组件
  component: PostsPage
})

// 页面组件
function PostsPage() {
  const { posts } = Route.useLoaderData()

  return (
    <div>
      <h1>Posts</h1>
      <For each={posts}>
        {(post) => <PostCard post={post} />}
      </For>
    </div>
  )
}
```

#### 6.2 动态路由参数

```typescript
// app/posts/[postId]/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.fetchQuery({
      queryKey: ['post', params.postId],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts/${params.postId}`)
        if (!res.ok) throw new Error('Post not found')
        return res.json()
      }
    })

    return { post }
  },

  // 错误边界
  errorComponent: ({ error }) => {
    return <div>Post not found: {error.message}</div>
  },

  component: PostDetailPage
})

function PostDetailPage() {
  const { post } = Route.useLoaderData()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

#### 6.3 服务端组件数据获取

```typescript
// app/dashboard/page.server.tsx
import { createServerFn } from 'your-framework/server'

// 服务端函数 - 只在服务端执行
const getDashboardData = createServerFn(async () => {
  const [posts, users, stats] = await Promise.all([
    db.posts.findAll(),
    db.users.findAll(),
    db.getStats()
  ])

  return { posts, users, stats }
})

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div>
      <h1>Dashboard</h1>
      <Stats stats={data.stats} />
      <PostList posts={data.posts} />
    </div>
  )
}
```

#### 6.4 客户端数据获取

```typescript
// components/PostList.tsx
import { createQuery } from '@tanstack/solid-query'

function PostList() {
  const postsQuery = createQuery(() => ({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      return res.json()
    },
    staleTime: 1000 * 60 * 5 // 5 分钟缓存
  }))

  return (
    <div>
      <Show when={postsQuery.data}>
        <For each={postsQuery.data}>
          {(post) => <PostCard post={post} />}
        </For>
      </Show>
    </div>
  )
}
```

#### 6.5 API 路由 (Next.js 模式)

```typescript
// app/api/posts/route.ts
import { Hono } from "hono";

const app = new Hono();

// GET /api/posts
app.get(async (c) => {
  const posts = await db.posts.findAll();
  return c.json(posts);
});

// POST /api/posts
app.post(async (c) => {
  const body = await c.req.json();
  const post = await db.posts.create(body);
  return c.json(post, { status: 201 });
});

export default app;

// app/api/posts/[id]/route.ts
import { Hono } from "hono";

const app = new Hono();

// GET /api/posts/123
app.get(async (c) => {
  const { id } = c.req.param();
  const post = await db.posts.findById(id);
  if (!post) return c.json({ error: "Not found" }, 404);
  return c.json(post);
});

// PUT /api/posts/123
app.put(async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const post = await db.posts.update(id, body);
  return c.json(post);
});

// DELETE /api/posts/123
app.delete(async (c) => {
  const { id } = c.req.param();
  await db.posts.delete(id);
  return c.json({ success: true });
});

export default app;
```

#### 6.6 服务端动作 (Server Actions)

```typescript
// app/posts/actions.ts
"use server"; // 标记为服务端动作

import { createAction } from "your-framework/server";

export const createPost = createAction(async (formData: FormData) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const post = await db.posts.create({ title, content });
  return post;
});

export const updatePost = createAction(
  async (id: string, formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const post = await db.posts.update(id, { title, content });
    return post;
  },
);
```

```typescript
// app/posts/new/page.tsx
import { createFileRoute } from '@tanstack/solid-router'
import { createPost } from '../actions'

export const Route = createFileRoute('/posts/new')({
  component: NewPostPage
})

function NewPostPage() {
  const navigate = Route.useNavigate()

  async function handleSubmit(event: Event) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    const post = await createPost(formData)
    navigate({ to: '/posts/$postId', params: { postId: post.id } })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

#### 6.7 数据加载流程

```
客户端导航到 /posts/123
    ↓
1. TanStack Router 匹配路由
    ↓
2. 执行 beforeLoad (认证/权限)
    ↓
3. 执行 loader (获取数据)
    ↓
   ├─ SSR: 在服务端执行，数据注入到 HTML
   └─ CSR: 在浏览器执行，支持缓存
    ↓
4. 渲染组件
    ↓
5. 水合 (SSR → CSR)
    ↓
6. 页面完成
```

#### 6.8 缓存与预取策略

```typescript
// app/posts/page.tsx
export const Route = createFileRoute("/posts")({
  loader: async ({ context }) => {
    return {
      posts: await context.queryClient.fetchQuery({
        queryKey: ["posts"],
        queryFn: () => fetch("/api/posts").then((r) => r.json()),
        staleTime: 1000 * 60 * 5, // 5 分钟
        gcTime: 1000 * 60 * 10, // 10 分钟缓存
      }),
    };
  },

  // 预取策略
  preload: ({ context }) => {
    // 在鼠标悬停时预取
    context.queryClient.prefetchQuery({
      queryKey: ["posts"],
      queryFn: () => fetch("/api/posts").then((r) => r.json()),
    });
  },
});
```

#### 6.9 错误处理

```typescript
// app/posts/[postId]/page.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    try {
      const post = await context.queryClient.fetchQuery({
        queryKey: ['post', params.postId],
        queryFn: async () => {
          const res = await fetch(`${context.API_BASE}/api/posts/${params.postId}`)
          if (!res.ok) {
            if (res.status === 404) {
              throw new NotFoundError('Post not found')
            }
            throw new Error('Failed to fetch')
          }
          return res.json()
        }
      })

      return { post }
    } catch (error) {
      // 转换为路由错误
      throw error
    }
  },

  // 错误边界
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) {
      return <NotFound message={error.message} />
    }
    return <ErrorFallback error={error} />
  }
})
```

#### 6.10 完整示例：博客系统

```typescript
// app/layout.tsx
import { createRootRoute, Outlet } from '@tanstack/solid-router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'

export const Route = createRootRoute({
  component: RootLayout
})

function RootLayout() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <header>
          <nav>
            <Route.Link to="/">Home</Route.Link>
            <Route.Link to="/posts">Posts</Route.Link>
            <Route.Link to="/about">About</Route.Link>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}

// app/posts/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    const posts = await context.queryClient.fetchQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts`)
        return res.json()
      }
    })

    return { posts }
  },

  component: PostsPage
})

function PostsPage() {
  const { posts } = Route.useLoaderData()

  return (
    <div>
      <h1>Blog Posts</h1>
      <div class="grid">
        <For each={posts}>
          {(post) => (
            <Route.Link to="/posts/$postId" params={{ postId: post.id }}>
              <article>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </article>
            </Route.Link>
          )}
        </For>
      </div>
    </div>
  )
}

// app/posts/$postId/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.fetchQuery({
      queryKey: ['post', params.postId],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts/${params.postId}`)
        if (!res.ok) throw new Error('Post not found')
        return res.json()
      }
    })

    return { post }
  },

  component: PostPage
})

function PostPage() {
  const { post } = Route.useLoaderData()

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{new Date(post.createdAt).toLocaleDateString()}</time>
      <div innerHTML={post.content} />
    </article>
  )
}

// app/api/posts/route.ts
import { Hono } from 'hono'

const app = new Hono()

app.get(async (c) => {
  const posts = await db.posts.findAll({
    orderBy: { createdAt: 'desc' }
  })
  return c.json(posts)
})

app.post(async (c) => {
  const body = await c.req.json()
  const post = await db.posts.create({
    title: body.title,
    content: body.content,
    excerpt: body.content.substring(0, 200)
  })
  return c.json(post, { status: 201 })
})

export default app

// app/api/posts/[id]/route.ts
import { Hono } from 'hono'

const app = new Hono()

app.get(async (c) => {
  const { id } = c.req.param()
  const post = await db.posts.findById(id)
  if (!post) return c.json({ error: 'Not found' }, 404)
  return c.json(post)
})

app.put(async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const post = await db.posts.update(id, body)
  return c.json(post)
})

app.delete(async (c) => {
  const { id } = c.req.param()
  await db.posts.delete(id)
  return c.json({ success: true })
})

export default app
```

#### 客户端数据获取

```typescript
// 客户端组件
import { createResource } from 'solid-js'

function ClientComponent() {
  const [data] = createResource(() =>
    fetch('/api/posts').then(r => r.json())
  )

  return <div>{data()?.title}</div>
}
```

### 7. 构建系统

#### Vite 配置

```typescript
// config/vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { frameworkPlugin } from "./framework/plugin";

export default defineConfig({
  plugins: [
    // SolidJS 支持
    solid({
      ssr: true,
      hot: true,
    }),

    // 框架插件
    frameworkPlugin({
      appDir: "./src/app",
      apiDir: "./src/app/api",
    }),
  ],

  // 开发服务器
  server: {
    port: 3000,
    hmr: true,
  },

  // 构建配置
  build: {
    target: "esnext",
    minify: "terser",
    rollupOptions: {
      // 代码分割
      output: {
        manualChunks: {
          vendor: [
            "solid-js",
            "@tanstack/solid-router",
            "@tanstack/solid-query",
          ],
          vendor2: ["hono"],
        },
      },
    },
  },

  // SSR 配置
  ssr: {
    noExternal: ["solid-js", "@tanstack/solid-router", "@tanstack/solid-query"],
  },
});
```

#### 框架插件 (内部实现)

```typescript
// framework/plugin.ts
import { Plugin } from "vite";
import { generateRouteTree } from "./route-generator";
import { registerAPIRoutes } from "./api-router";

export function frameworkPlugin(options: {
  appDir: string;
  apiDir: string;
}): Plugin {
  return {
    name: "framework-plugin",

    // 开发阶段：生成路由
    async configResolved(config) {
      if (config.command === "serve") {
        // 生成客户端路由
        await generateRouteTree(options.appDir);

        // 注册 API 路由
        await registerAPIRoutes(options.apiDir);
      }
    },

    // 构建阶段：处理 SSR
    async buildStart() {
      // 生成路由清单
      const routes = await scanRoutes(options.appDir);
      this.emitFile({
        type: "asset",
        fileName: "routes.json",
        source: JSON.stringify(routes, null, 2),
      });
    },

    // 热重载
    handleHotUpdate({ file, server }) {
      if (file.includes(options.appDir)) {
        // 路由变更，重新生成
        generateRouteTree(options.appDir);
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
```

#### 构建流程

```
开发模式 (bun dev)
├── Vite Dev Server 启动
├── 框架插件初始化
│   ├── 扫描 app/ 目录
│   ├── 生成 TanStack 路由树
│   └── 注册 Hono API 路由
├── 启动 Hono 服务器
│   ├── API 路由: /api/*
│   ├── SSR 渲染器: /*
│   └── 静态文件服务
└── 热重载监听
    ├── 文件变更 → 重新生成路由
    └── API 变更 → 重新注册路由

生产构建 (bun build)
├── 客户端构建
│   ├── 扫描 app/ 目录
│   ├── 生成路由清单
│   ├── 打包 SolidJS 组件
│   └── 生成 hydration 入口
├── 服务端构建
│   ├── 打包 SSR 渲染器
│   ├── 打包 API 路由
│   └── 打包服务端组件
├── 静态生成 (SSG)
│   ├── 预渲染页面
│   ├── 生成 HTML 模板
│   └── 提取 CSS
└── 资源优化
    ├── 代码分割
    ├── 压缩
    └── Source map
```

#### 开发服务器集成

```typescript
// framework/dev-server.ts
import { Hono } from "hono";
import { createServer } from "vite";
import { fileURLToPath } from "url";

export async function startDevServer() {
  // 1. 启动 Vite
  const vite = await createServer({
    server: { middlewareMode: true },
  });

  // 2. 创建 Hono 应用
  const app = new Hono();

  // 3. 使用 Vite 中间件
  app.use("*", async (c, next) => {
    // API 路由优先
    if (c.req.path.startsWith("/api/")) {
      return next();
    }

    // Vite 处理静态资源
    return new Promise((resolve) => {
      vite.middlewares(c.req.raw, c.res.raw, () => {
        resolve(next());
      });
    });
  });

  // 4. SSR 渲染
  app.get("*", async (c) => {
    const url = c.req.url;

    // 通过 Vite 加载模块
    const { render } = await vite.ssrLoadModule("/src/server/render.tsx");

    const html = await render(url, {
      queryClient: createQueryClient(),
      user: await getUser(c),
    });

    return c.html(html);
  });

  // 5. 启动服务器
  app.listen(3000, () => {
    console.log("🚀 Dev server running at http://localhost:3000");
  });
}
```

#### 生产服务器

```typescript
// framework/prod-server.ts
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { render } from "./dist/server/render.js";
import { queryClient } from "./dist/server/query-client.js";

const app = new Hono();

// 静态资源
app.use("/assets/*", serveStatic({ root: "./dist/client" }));

// API 路由
const apiRoutes = await import("./dist/server/api-routes.js");
app.route("/api", apiRoutes.default);

// SSR
app.get("*", async (c) => {
  const url = c.req.url;
  const html = await render(url, {
    queryClient,
    user: await getUser(c),
  });
  return c.html(html);
});

app.listen(3000, () => {
  console.log("🚀 Production server running on port 3000");
});
```

### 8. 开发体验

#### CLI 工具

```typescript
// framework/cli.ts
import { Command } from "commander";

const program = new Command();

program.name("my-framework").version("1.0.0");

// 开发服务器
program
  .command("dev")
  .description("Start development server")
  .option("-p, --port <number>", "Port number", "3000")
  .action(async (options) => {
    const { startDevServer } = await import("./dev-server");
    startDevServer(options.port);
  });

// 生产构建
program
  .command("build")
  .description("Build for production")
  .action(async () => {
    const { build } = await import("./build");
    await build();
  });

// 生产启动
program
  .command("start")
  .description("Start production server")
  .option("-p, --port <number>", "Port number", "3000")
  .action(async (options) => {
    const { startProdServer } = await import("./prod-server");
    startProdServer(options.port);
  });

// 生成页面
program
  .command("generate page <name>")
  .description("Generate a new page")
  .option("-s, --server", "Generate server component")
  .option("-d, --dynamic", "Generate dynamic route")
  .action(async (name, options) => {
    const { generatePage } = await import("./generators/page");
    await generatePage(name, options);
  });

// 生成 API 路由
program
  .command("generate api <name>")
  .description("Generate API route")
  .option("-c, --crud", "Generate CRUD endpoints")
  .action(async (name, options) => {
    const { generateAPI } = await import("./generators/api");
    await generateAPI(name, options);
  });

// 生成组件
program
  .command("generate component <name>")
  .description("Generate component")
  .option("-s, --server", "Server component")
  .action(async (name, options) => {
    const { generateComponent } = await import("./generators/component");
    await generateComponent(name, options);
  });

program.parse();
```

#### 生成器示例

```typescript
// framework/generators/page.ts
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export async function generatePage(name: string, options: any) {
  const appDir = "./src/app";
  const pagePath = join(appDir, name);

  // 创建目录
  mkdirSync(pagePath, { recursive: true });

  // 生成文件内容
  const content = options.server
    ? generateServerPage(name)
    : generateClientPage(name);

  writeFileSync(join(pagePath, "page.tsx"), content);

  console.log(`✅ Generated page: ${name}`);
}

function generateClientPage(name: string) {
  return `import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('${name}')({
  loader: async ({ context }) => {
    // TODO: Implement data loading
    return { data: null }
  },
  
  component: ${name.replace("/", "").replace("-", "").replace("_", "")}Page
})

function ${name.replace("/", "").replace("-", "").replace("_", "")}Page() {
  const { data } = Route.useLoaderData()
  
  return (
    <div>
      <h1>${name}</h1>
      <p>Implement your page here</p>
    </div>
  )
}
`;
}

function generateServerPage(name: string) {
  return `import { createServerFn } from 'your-framework/server'

const getData = createServerFn(async () => {
  // TODO: Implement server-side data fetching
  return { data: null }
})

export default async function Page() {
  const data = await getData()
  
  return (
    <div>
      <h1>${name}</h1>
      <p>Server-rendered content</p>
    </div>
  )
}
`;
}
```

#### 配置文件

```typescript
// leeforge.config.ts
import { defineConfig } from "your-framework";

export default defineConfig({
  // 路由配置
  routes: {
    base: "/",
    trailingSlash: "never",
    // 路由组前缀
    groups: {
      "(dashboard)": "/dashboard",
      "(admin)": "/admin",
    },
  },

  // Vite 配置
  vite: {
    server: {
      port: 3000,
    },
  },
});
```

    outDir: "dist",
    sourcemap: true,
    minify: true,
    // 代码分割
    rollup: {
      output: {
        manualChunks: {
          vendor: ["solid-js", "@tanstack/solid-router"],
          query: ["@tanstack/solid-query"],
          hono: ["hono"],
        },
      },
    },

},

// SSR 配置
ssr: {
external: [],
noExternal: ["solid-js", "@tanstack/*"],
// 预渲染
prerender: {
routes: ["/", "/about", "/contact"],
crawl: true,
},
},

// 中间件
middleware: ["./app/middleware.ts", "./lib/middleware/auth.ts"],

// API 配置
api: {
prefix: "/api",
timeout: 10000,
},

// 开发服务器
devServer: {
port: 3000,
hmr: true,
https: false,
},
});

````

#### 开发工具集成

```typescript
// framework/devtools.ts
export function setupDevTools() {
  if (typeof window !== "undefined") {
    // 注入调试工具
    window.__FRAMEWORK_DEBUG__ = {
      // 路由调试
      getRoutes: () => {
        return window.__ROUTE_TREE__;
      },

      // 查询调试
      getQueryCache: () => {
        const queryClient = window.__QUERY_CLIENT__;
        return queryClient?.getQueryCache();
      },

      // 性能监控
      getPerfMetrics: () => {
        return {
          renderTime: window.__PERF_RENDER__,
          dataFetchTime: window.__PERF_DATA__,
        };
      },
    };

    console.log("🛠️ Framework DevTools ready");
  }
}
````

#### 配置文件

```typescript
// leeforge.config.ts
import { defineConfig } from "your-framework";
// 需要支持vite打包的所有功能
export default defineConfig({
  // 路由配置
  routes: {
    base: "/",
    trailingSlash: "never",
  },

  // 构建配置
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: true,
  },

  // SSR 配置
  ssr: {
    external: [],
    noExternal: [],
  },

  // 中间件
  middleware: ["./app/middleware.ts"],
});
```

## 性能优化策略

### 1. 代码分割

- 路由级代码分割
- 组件级懒加载
- 按需导入

### 2. 缓存策略

- SSR 结果缓存
- API 响应缓存
- 静态资源 CDN

### 3. 水合优化

- 部分水合 (Partial Hydration)
- 选择性水合
- 无水合模式 (Islands Architecture)

### 4. 资源优化

- 图片优化
- 字体优化
- CSS 提取

## 测试策略

### 单元测试

```typescript
// 测试路由匹配
describe("RouteMatcher", () => {
  test("matches static routes", () => {
    const matcher = new RouteMatcher("./app");
    const route = matcher.match("/about");
    expect(route.path).toBe("/about");
  });
});
```

### 集成测试

```typescript
// 测试完整渲染流程
test("SSR renders correctly", async () => {
  const result = await app.render("/");
  expect(result.html).toContain("<h1>Hello");
  expect(result.status).toBe(200);
});
```

### E2E 测试

```typescript
// Playwright 测试
test("full user flow", async ({ page }) => {
  await page.goto("/");
  await page.click("text=About");
  await expect(page).toHaveURL("/about");
});
```

## 部署方案

### 1. Node.js

```bash
bun build
bun start
```

### 2. Bun 运行时

```bash
bun run dist/server.js
```

### 3. Serverless

- Vercel
- Netlify
- Cloudflare Workers

### 4. Docker

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install && bun build
EXPOSE 3000
CMD ["bun", "start"]
```

## 开发路线图

### Phase 1: 核心路由与渲染 ✅

- [x] TanStack Router 集成
- [x] 文件系统路由生成
- [x] SSR 渲染管道
- [x] 客户端水合
- [x] 基础 CLI 框架

### Phase 2: 数据层 🚧

- [x] TanStack Query 集成
- [ ] Loader 函数支持 (SSR/CSR)
- [ ] Server Actions
- [ ] API 路由 (Hono)
- [ ] 数据缓存策略
- [ ] 错误处理

### Phase 3: 高级功能

- [ ] 服务端组件 (.server.tsx)
- [ ] 中间件系统
- [ ] 路由组和布局
- [ ] 动态路由参数
- [ ] 404/错误页面
- [ ] 加载状态

### Phase 4: 构建与优化

- [ ] Vite 插件开发
- [ ] 生产构建流程
- [ ] 代码分割
- [ ] SSG 支持
- [ ] 静态资源优化
- [ ] Source maps

### Phase 5: 开发体验

- [ ] 生成器 (page/api/component)
- [ ] 热重载优化
- [ ] 开发工具
- [ ] TypeScript 支持
- [ ] 配置系统

### Phase 6: 生产就绪

- [ ] 测试框架
- [ ] 文档生成
- [ ] 部署适配
- [ ] 性能监控
- [ ] 生产优化

## 技术栈依赖

### 核心依赖

```json
{
  "dependencies": {
    "solid-js": "^1.8.0",
    "@tanstack/solid-router": "^1.0.0",
    "@tanstack/solid-query": "^5.0.0",
    "hono": "^4.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "vite-plugin-solid": "^2.8.0",
    "bun-types": "^1.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 为什么选择这些技术？

1. **SolidJS**:
   - 🚀 比 React 更快，更小的 bundle
   - 💡 响应式系统更简单直观
   - 📦 细粒度更新，无需虚拟 DOM

2. **TanStack Router**:
   - 🎯 文件系统路由，类似 Next.js
   - ⚡️ 内置 loader 支持，SSR/CSR 统一
   - 🔒 类型安全，强大的类型推断
   - 🎨 支持路由守卫和中间件

3. **TanStack Query**:
   - 🔄 自动缓存和重新获取
   - 💾 SSR 状态水合
   - 🎯 乐观更新支持
   - 📊 开发工具

4. **Hono**:
   - 📦 超轻量 (15KB)
   - ⚡️ 高性能
   - 🔌 多运行时支持 (Bun, Node.js, Cloudflare)
   - 🎨 优雅的 API 设计

5. **Vite**:
   - ⚡️ 极速开发体验
   - 🔥 热重载
   - 🎨 优秀插件生态
   - 📦 现代构建

6. **Bun**:
   - 🚀 超快包管理
   - ⚡️ 快速运行时
   - 🎯 原生 TypeScript
   - 📦 单一二进制

## 与 Next.js 对比

| 特性         | Next.js       | 我们的框架              |
| ------------ | ------------- | ----------------------- |
| **运行时**   | Node.js       | Bun                     |
| **UI 框架**  | React         | SolidJS                 |
| **路由**     | Next.js 内置  | TanStack Router         |
| **数据获取** | Next.js 内置  | TanStack Query + Loader |
| **构建工具** | Next.js 内置  | Vite                    |
| **API 路由** | Next.js 内置  | Hono                    |
| **包管理器** | npm/yarn/pnpm | Bun                     |
| **体积**     | ~500KB+       | ~150KB                  |
| **性能**     | 好            | 更好                    |
| **开发体验** | 好            | 更快                    |

## 架构优势

### 1. 混合数据获取模式

```
✅ TanStack Loader (前端路由)
   - SSR/CSR 统一 API
   - 自动缓存
   - 路由守卫

✅ Next.js API 路由 (后端)
   - RESTful 端点
   - 灵活的业务逻辑
   - 服务端动作

✅ 两者结合，各司其职
```

### 2. 性能优化

```
✅ SolidJS - 细粒度响应式
✅ Vite - 极速 HMR
✅ Bun - 快速执行
✅ TanStack Query - 智能缓存
✅ 代码分割 - 按需加载
```

### 3. 开发体验

```
✅ 文件系统路由 - 零配置
✅ 类型安全 - 完整推断
✅ 热重载 - 即时反馈
✅ 生成器 - 快速创建
✅ DevTools - 调试友好
```

## 完整示例：博客应用

### 目录结构

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   └── [postId]/
│   │       └── page.tsx
│   └── api/
│       ├── posts/
│       │   └── route.ts
│       └── posts/
│           └── [id]/
│               └── route.ts
├── components/
│   ├── PostCard.tsx
│   └── CommentSection.tsx
└── lib/
    ├── db.ts
    └── auth.ts
```

### 路由定义

```typescript
// app/posts/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    const posts = await context.queryClient.fetchQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts`)
        return res.json()
      }
    })
    return { posts }
  },

  component: PostsPage
})

function PostsPage() {
  const { posts } = Route.useLoaderData()

  return (
    <div>
      <h1>Blog Posts</h1>
      <For each={posts}>
        {(post) => (
          <Route.Link to="/posts/$postId" params={{ postId: post.id }}>
            <PostCard post={post} />
          </Route.Link>
        )}
      </For>
    </div>
  )
}
```

### API 路由

```typescript
// app/api/posts/route.ts
import { Hono } from "hono";

const app = new Hono();

app.get(async (c) => {
  const posts = await db.posts.findAll({
    orderBy: { createdAt: "desc" },
  });
  return c.json(posts);
});

app.post(async (c) => {
  const body = await c.req.json();
  const post = await db.posts.create(body);
  return c.json(post, { status: 201 });
});

export default app;
```

### 页面详情

```typescript
// app/posts/[postId]/page.tsx
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.fetchQuery({
      queryKey: ['post', params.postId],
      queryFn: async () => {
        const res = await fetch(`${context.API_BASE}/api/posts/${params.postId}`)
        if (!res.ok) throw new Error('Post not found')
        return res.json()
      }
    })
    return { post }
  },

  component: PostDetailPage
})

function PostDetailPage() {
  const { post } = Route.useLoaderData()

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{new Date(post.createdAt).toLocaleDateString()}</time>
      <div innerHTML={post.content} />
      <CommentSection postId={post.id} />
    </article>
  )
}
```

## 总结

这个设计文档定义了一个现代化的全栈框架，结合了当前最佳实践：

### ✅ 核心优势

1. **性能优先**: SolidJS + Vite + Bun 的极致性能
2. **开发者体验**: 类似 Next.js 的简单 API，但更灵活
3. **类型安全**: 完整的 TypeScript 支持
4. **混合架构**: TanStack Router + Hono，各司其职
5. **现代化**: 原生 ESM，现代工具链

### 🎯 目标用户

- 想要 Next.js 体验但追求更高性能的开发者
- 喜欢 SolidJS 响应式模型的开发者
- 需要灵活 API 设计的全栈开发者
- 追求极致开发体验的团队

### 🚀 下一步

1. 实现路由系统 (TanStack Router 集成)
2. 实现 SSR 渲染管道
3. 开发 CLI 工具
4. 集成数据层 (TanStack Query)
5. 实现 API 路由 (Hono)

这个框架将提供 Next.js 的开发体验，但具有更好的性能和更灵活的架构！

## 技术决策

### 为什么选择这些技术？

1. **SolidJS**: 比 React 更快，更小的 bundle，响应式系统更简单
2. **Vite**: 极速开发体验，优秀的插件生态
3. **Hono**: 轻量级 (仅 15KB)，高性能，支持多种运行时
4. **Bun**: 超快的包管理和运行时，原生支持 TypeScript

### 与 Next.js 的差异

| 特性     | Next.js       | 我们的框架 |
| -------- | ------------- | ---------- |
| 运行时   | Node.js       | Bun        |
| UI 框架  | React         | SolidJS    |
| 构建工具 | Next.js 内置  | Vite       |
| 包管理器 | npm/yarn/pnpm | Bun        |
| 体积     | 较大          | 更小       |
| 性能     | 好            | 更好       |

## 示例代码

### 完整的页面示例

```typescript
// app/posts/[id]/page.tsx
import { notFound } from 'your-framework'

export async function getData({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`)
  if (!res.ok) return notFound()
  return { post: await res.json() }
}

export default function PostPage({ data, params }) {
  return (
    <article>
      <h1>{data.post.title}</h1>
      <p>{data.post.content}</p>
      <footer>Post ID: {params.id}</footer>
    </article>
  )
}
```

### API 路由示例

```typescript
// app/api/posts/route.ts
import { Hono } from "hono";

const app = new Hono();

app.get(async (c) => {
  const posts = await db.posts.findAll();
  return c.json(posts);
});

app.post(async (c) => {
  const body = await c.req.json();
  const post = await db.posts.create(body);
  return c.json(post, { status: 201 });
});

export default app;
```

### 中间件示例

```typescript
// app/middleware.ts
import { defineMiddleware } from "your-framework";

export const middleware = defineMiddleware(async (context) => {
  // 日志
  console.log(`[${new Date().toISOString()}] ${context.url}`);

  // 安全头
  context.setHeader("X-Frame-Options", "DENY");
  context.setHeader("X-Content-Type-Options", "nosniff");

  // 认证
  if (context.url.startsWith("/admin")) {
    const token = context.req.header("Authorization");
    if (!token) {
      return context.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
});
```

## 总结

这个设计文档定义了一个现代化的全栈框架，结合了当前最佳实践：

- ✅ **开发者体验**: 类似 Next.js 的简单 API
- ✅ **性能**: SolidJS + Vite + Bun 的极致性能
- ✅ **灵活性**: 支持 SSR、SSG、API 路由
- ✅ **类型安全**: 完整的 TypeScript 支持
- ✅ **可扩展**: 插件系统和中间件

接下来可以开始实现核心模块，从路由系统和 SSR 渲染器开始。
