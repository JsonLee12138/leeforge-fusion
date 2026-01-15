# Leeforge Fusion - 使用文档

**版本**: 0.1.0  
**目标读者**: 框架用户  
**最后更新**: 2026-01-15

---

## 🚀 快速开始

### 1. 安装

```bash
# 使用 npm
npm install @leeforge/fusion

# 使用 yarn
yarn add @leeforge/fusion

# 使用 pnpm
pnpm add @leeforge/fusion
```

### 2. 项目结构

```
my-app/
├── app/                    # 页面和路由
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── posts/
│   │   ├── page.tsx        # 列表页
│   │   └── [id]/           # 动态路由
│   │       └── page.tsx
│   └── api/                # API 路由
│       └── posts/
│           └── route.ts
├── framework.config.ts     # 配置文件
├── package.json
└── vite.config.ts
```

### 3. 配置文件

```typescript
// framework.config.ts
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  routes: {
    base: "/",
    trailingSlash: "never",
    groups: {
      "(dashboard)": "/dashboard",
      "(admin)": "/admin",
    },
    guards: {
      "/admin/*": "./middleware/auth.ts",
      "/dashboard/*": "./middleware/auth.ts",
    },
    ignore: ["**/*.spec.ts", "**/test/**"],
  },
});
```

### 4. package.json 脚本

```json
{
  "scripts": {
    "dev": "leeforge dev",
    "build": "leeforge build",
    "generate": "leeforge generate",
    "preview": "leeforge preview"
  }
}
```

### 5. 启动开发

```bash
npm run dev
```

访问: http://localhost:3000

---

## 📝 路由系统

### 文件约定

| 文件类型          | 路由路径 | 描述       |
| ----------------- | -------- | ---------- |
| `page.tsx`        | `/path`  | 页面组件   |
| `page.server.tsx` | `/path`  | 服务端组件 |
| `layout.tsx`      | `/path`  | 布局组件   |
| `route.ts`        | `/path`  | API 路由   |

### 路由示例

#### 静态路由

```
app/
└── about/
    └── page.tsx
```

**路由**: `/about`

#### 动态路由

```
app/
└── posts/
    └── [id]/
        └── page.tsx
```

**路由**: `/posts/:id`

#### 路由组

```
app/
└── (dashboard)/
    ├── page.tsx
    └── settings/
        └── page.tsx
```

**路由**: `/dashboard`, `/dashboard/settings`

#### 嵌套路由

```
app/
├── page.tsx              # /
├── posts/
│   ├── page.tsx          # /posts
│   └── [id]/
│       └── page.tsx      # /posts/:id
```

### 页面组件

```typescript
// app/posts/[id]/page.tsx
import { Route } from "./.framework/routes/posts/$id";

export default function PostPage() {
  const { post } = Route.useLoaderData();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### 数据加载

```typescript
export const loader = async ({ params, context }) => {
  const post = await fetch(`${context.API_BASE}/posts/${params.id}`, {
    headers: {
      Authorization: `Bearer ${context.user?.token}`,
    },
  }).then((r) => r.json());

  return { post };
};
```

---

## 🔐 中间件和守卫

### 创建中间件

```typescript
// middleware/logger.ts
import { createMiddleware } from "hono/factory";

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  console.log(`${c.req.method} ${c.req.path} - ${duration}ms`);
});
```

### 使用中间件

```typescript
// server.ts
import { loggerMiddleware, authMiddleware } from "./middleware";

app.use(loggerMiddleware);
app.use(authMiddleware);
```

### 路由守卫

```typescript
// middleware/auth.ts
import { defineGuard, redirect } from "@leeforge/fusion";

export const requireAuth = defineGuard((ctx) => {
  if (!ctx.user) {
    throw redirect("/login");
  }
});

export const requireAdmin = defineGuard((ctx) => {
  if (!ctx.user?.role !== "admin") {
    throw redirect("/unauthorized");
  }
});
```

### 在页面中使用守卫

```typescript
// app/dashboard/page.tsx
import { requireAuth } from "../middleware/auth";

export const loader = async ({ context }) => {
  await requireAuth(context);

  return {
    stats: await getDashboardStats()
  };
};

export default function Dashboard() {
  const { stats } = Route.useLoaderData();
  return <div>Stats: {stats.total}</div>;
}
```

### 守卫链

```typescript
import { createGuardChain, requireAuth, requireAdmin } from "@leeforge/fusion";

const adminChain = createGuardChain(requireAuth, requireAdmin);

export const loader = async ({ context }) => {
  await adminChain(context);
  return { data: "..." };
};
```

---

## 🌐 API 路由

### 创建 API

```typescript
// app/api/posts/route.ts

// GET /api/posts
export async function GET() {
  const posts = await db.posts.findAll();
  return Response.json(posts);
}

// POST /api/posts
export async function POST(req: Request) {
  const data = await req.json();
  const post = await db.posts.create(data);
  return Response.json(post, { status: 201 });
}

// GET /api/posts/:id
export async function GET(req: Request, { params }: any) {
  const post = await db.posts.findById(params.id);
  if (!post) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(post);
}

// DELETE /api/posts/:id
export async function DELETE(req: Request, { params }: any) {
  await db.posts.delete(params.id);
  return Response.json({ success: true });
}
```

### 使用 API

```typescript
// 客户端调用
const posts = await fetch("/api/posts").then((r) => r.json());
const newPost = await fetch("/api/posts", {
  method: "POST",
  body: JSON.stringify({ title: "New" }),
}).then((r) => r.json());
```

---

## 💾 数据获取

### Query Client 配置

```typescript
import { createQueryClient } from "@leeforge/fusion";

const queryClient = createQueryClient({
  ssr: true, // 启用 SSR
  staleTime: 1000 * 60 * 5, // 5 分钟
  gcTime: 1000 * 60 * 10, // 10 分钟
});
```

### 在 Loader 中使用

```typescript
export const loader = async ({ params, context }) => {
  const post = await context.queryClient.fetchQuery({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const res = await fetch(`${context.API_BASE}/posts/${params.id}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
  });

  return { post };
};
```

### 类型安全的数据获取

```typescript
import { apiFetch, withAuth } from "@leeforge/fusion";

interface User {
  id: string;
  name: string;
  email: string;
}

// 带认证的请求
const user = await apiFetch<User>("/api/user", withAuth(token));

// 自定义选项
const posts = await apiFetch<Post[]>("/api/posts", {
  headers: {
    "X-Custom-Header": "value",
  },
});
```

---

## 🔧 CLI 工具

### 开发服务器

```bash
# 启动开发服务器
leeforge dev

# 指定端口
leeforge dev --port 3000

# 严格模式（类型检查）
leeforge dev --strict
```

### 构建

```bash
# 生产构建
leeforge build

# 查看构建分析
leeforge build --analyze
```

### 代码生成

```bash
# 生成页面
leeforge generate page posts/list
# 创建: app/posts/list/page.tsx

# 生成 API
leeforge generate api users/[id]
# 创建: app/api/users/[id]/route.ts

# 生成组件
leeforge generate component Button
# 创建: src/components/Button.tsx

# 生成带守卫的页面
leeforge generate page admin/dashboard --guard
```

### 预览

```bash
# 预览生产构建
leeforge preview

# 指定端口
leeforge preview --port 3000
```

---

## 🎨 样式和主题

### CSS 文件

```typescript
// app/layout.tsx
export default function Layout({ children }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="/index.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 主题支持

```typescript
// 使用 CSS 变量
:root {
  --primary: #3498db;
  --secondary: #2980b9;
  --background: #ffffff;
  --text: #333333;
}

[data-theme="dark"] {
  --background: #1a1a1a;
  --text: #ffffff;
}
```

---

## 🔍 调试和故障排除

### 查看路由树

```bash
# 生成路由报告
npm run generate

# 查看输出
cat .framework/routes/manifest.json
```

### 检查中间件

```bash
# 启用详细日志
DEBUG=leeforge:* leeforge dev

# 查看请求流
# 输出示例:
# [leeforge] Request: GET /posts/1
# [leeforge] Middleware: logger
# [leeforge] Middleware: auth
# [leeforge] Loader executed
# [leeforge] Rendered in 23ms
```

### 常见问题

#### 路由不工作

**症状**: 404 错误

**解决**:

1. 检查文件命名是否正确
2. 确认文件在 `app/` 目录
3. 运行 `npm run generate` 查看路由清单
4. 检查 `framework.config.ts` 中的 ignore 配置

#### 守卫不生效

**症状**: 应该被重定向但没有

**解决**:

1. 确保守卫抛出 `redirect()` 异常
2. 检查上下文中的 `user` 数据
3. 验证守卫链顺序
4. 查看控制台错误

#### 数据不显示

**症状**: 页面空白或加载失败

**解决**:

1. 检查 API 端点是否返回数据
2. 验证 loader 返回值格式
3. 查看浏览器网络面板
4. 检查 Query Client 配置

#### 构建失败

**症状**: `npm run build` 报错

**解决**:

1. 运行 `npm run typecheck` 检查类型错误
2. 清理缓存: `rm -rf node_modules/.vite`
3. 重新安装: `npm ci`
4. 检查依赖版本冲突

---

## 🚀 性能优化

### 1. 路由缓存

```typescript
// framework.config.ts
export default defineConfig({
  routes: {
    cache: true, // 启用路由缓存
  },
});
```

### 2. 懒加载组件

```typescript
import { lazy } from "solid-js";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### 3. 数据缓存

```typescript
export const loader = async ({ context }) => {
  return context.queryClient.fetchQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5 分钟缓存
    gcTime: 1000 * 60 * 10, // 10 分钟垃圾回收
  });
};
```

### 4. 图片优化

```typescript
// 使用 WebP 格式
<img
  src="/images/photo.webp"
  loading="lazy"
  width={800}
  height={600}
  alt="Description"
/>
```

---

## 🛡️ 安全最佳实践

### 1. 输入验证

```typescript
export async function POST(req: Request) {
  const data = await req.json();

  // 验证数据
  if (!data.title || data.title.length < 3) {
    return Response.json(
      { error: "Title must be at least 3 characters" },
      { status: 400 },
    );
  }

  // 继续处理...
}
```

### 2. 认证检查

```typescript
export const loader = async ({ context }) => {
  if (!context.user) {
    throw redirect("/login");
  }

  // 用户已认证，继续...
  return { data: "..." };
};
```

### 3. CORS 配置

```typescript
// middleware/cors.ts
export const corsMiddleware = createMiddleware(async (c, next) => {
  c.res.headers.set("Access-Control-Allow-Origin", "https://yourdomain.com");
  c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  c.res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (c.req.method === "OPTIONS") {
    return c.json({}, 204);
  }

  await next();
});
```

---

## 📊 监控和日志

### 性能监控

```typescript
// middleware/performance.ts
export const performanceMiddleware = createMiddleware(async (c, next) => {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;

  if (duration > 1000) {
    console.warn(`Slow request: ${c.req.path} took ${duration}ms`);
  }
});
```

### 错误日志

```typescript
// middleware/error-logger.ts
export const errorLoggerMiddleware = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (error) {
    console.error("Error:", {
      path: c.req.path,
      method: c.req.method,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
});
```

---

## 🌍 环境变量

### .env 文件

```bash
# .env.development
VITE_API_BASE=http://localhost:3001
VITE_AUTH_SECRET=dev-secret

# .env.production
VITE_API_BASE=https://api.example.com
VITE_AUTH_SECRET=prod-secret
```

### 使用环境变量

```typescript
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const isProd = import.meta.env.PROD;
```

---

## 📦 部署

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server/prod-server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

### 部署脚本

```bash
# 生成部署文件
npm run generate:deploy

# 构建 Docker 镜像
docker build -t myapp .

# 运行
docker run -p 3000:3000 myapp
```

---

## 🎯 成功案例

### 博客系统

```
app/
├── page.tsx                    # 首页
├── posts/
│   ├── page.tsx                # 文章列表
│   └── [slug]/
│       └── page.tsx            # 文章详情
├── about/
│   └── page.tsx                # 关于页面
├── (dashboard)/                # 需要登录
│   ├── page.tsx                # 仪表盘
│   └── posts/
│       ├── page.tsx            # 管理文章
│       └── [id]/
│           └── page.tsx        # 编辑文章
└── api/
    └── posts/
        └── route.ts            # 文章 API
```

### 电子商务

```
app/
├── page.tsx                    # 首页
├── products/
│   ├── page.tsx                # 产品列表
│   └── [id]/
│       └── page.tsx            # 产品详情
├── cart/
│   └── page.tsx                # 购物车
├── checkout/
│   └── page.tsx                # 结账
└── api/
    ├── products/
    │   └── route.ts            # 产品 API
    └── cart/
        └── route.ts            # 购物车 API
```

---

## 📞 获取帮助

### 文档

- [API 参考](./README.md)
- [开发文档](./DEVELOPMENT.md)
- [GitHub Issues](https://github.com/your-org/leeforge-fusion/issues)

### 社区

- **Discord**: 加入我们的社区
- **GitHub Discussions**: 提问和讨论
- **Stack Overflow**: 使用标签 `leeforge-fusion`

### 报告问题

```bash
# 使用 CLI 报告
leeforge bug-report

# 或在 GitHub 提交 issue
# https://github.com/your-org/leeforge-fusion/issues/new
```

---

## 🎓 学习资源

### 入门教程

1. [5 分钟快速开始](#快速开始)
2. [路由系统详解](#路由系统)
3. [中间件和守卫](#中间件和守卫)
4. [数据获取最佳实践](#数据获取)

### 进阶主题

- SSR 工作原理
- 性能优化技巧
- 安全最佳实践
- 部署策略

### 示例项目

- [博客示例](../examples/blog/README.md)
- [电子商务](https://github.com/your-org/leeforge-ecommerce-example)
- [仪表盘](https://github.com/your-org/leeforge-dashboard-example)

---

## 📋 检查清单

### 项目启动

- [ ] 安装依赖
- [ ] 创建配置文件
- [ ] 设置 package.json 脚本
- [ ] 创建第一个页面
- [ ] 启动开发服务器

### 生产部署

- [ ] 运行类型检查
- [ ] 通过所有测试
- [ ] 构建生产版本
- [ ] 验证构建输出
- [ ] 配置环境变量
- [ ] 设置监控和日志

### 性能优化

- [ ] 启用路由缓存
- [ ] 使用懒加载
- [ ] 优化图片资源
- [ ] 配置 CDN
- [ ] 启用压缩

---

**版本**: 0.1.0  
**最后更新**: 2026-01-15  
**维护者**: Leeforge Team
