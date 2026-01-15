# Leeforge Blog Example

这是一个完整的博客示例，展示了 Leeforge Fusion 的所有核心功能。

## 功能特性

- ✅ 路由系统（动态路由、路由组）
- ✅ SSR 渲染
- ✅ 中间件（认证、日志）
- ✅ 路由守卫
- ✅ 数据获取
- ✅ API 路由

## 项目结构

```
examples/blog/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── posts/
│   │   │   ├── page.tsx        # 文章列表
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 文章详情
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx        # 仪表盘
│   │   │   └── settings/
│   │   │       └── page.tsx    # 设置
│   │   └── api/
│   │       └── posts/
│   │           └── route.ts    # API 端点
│   ├── lib/
│   │   ├── db.ts               # 数据库模拟
│   │   └── types.ts            # 类型定义
│   ├── middleware/
│   │   ├── auth.ts             # 认证守卫
│   │   └── logger.ts           # 日志中间件
│   ├── entry-client.tsx        # 客户端入口
│   └── entry-server.tsx        # 服务端入口
├── framework.config.ts         # 框架配置
├── package.json
├── vite.config.ts
└── server.js                   # Express 服务器
```

## 快速开始

### 1. 安装依赖

```bash
cd examples/blog
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 生成路由

```bash
npm run generate
```

## 核心文件说明

### 路由文件

**app/page.tsx** - 首页

```typescript
export default function Home() {
  return <div>Welcome to the Blog!</div>
}
```

**app/posts/page.tsx** - 文章列表

```typescript
export default function Posts() {
  const { posts } = Route.useLoaderData()
  return (
    <div>
      {posts.map(post => (
        <a href={`/posts/${post.id}`}>{post.title}</a>
      ))}
    </div>
  )
}

export const loader = async () => {
  const posts = await fetch('/api/posts').then(r => r.json())
  return { posts }
}
```

**app/posts/[id]/page.tsx** - 文章详情

```typescript
export default function Post() {
  const { post } = Route.useLoaderData()
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}

export const loader = async ({ params }) => {
  const post = await fetch(`/api/posts/${params.id}`).then(r => r.json())
  return { post }
}
```

### 中间件

**middleware/auth.ts**

```typescript
import { defineGuard, redirect } from "@leeforge/fusion";

export const requireAuth = defineGuard((ctx) => {
  if (!ctx.user) {
    throw redirect("/login");
  }
});
```

**middleware/logger.ts**

```typescript
import { createMiddleware } from "hono/factory";

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  console.log(`${c.req.method} ${c.req.path} - ${Date.now() - start}ms`);
});
```

### API 路由

**app/api/posts/route.ts**

```typescript
export async function GET() {
  const posts = await db.posts.findAll();
  return Response.json(posts);
}

export async function POST(req: Request) {
  const data = await req.json();
  const post = await db.posts.create(data);
  return Response.json(post, { status: 201 });
}
```

### 配置

**framework.config.ts**

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
  },
});
```

## 浏览器功能

### 首页 (/)

- 显示欢迎消息
- 链接到文章列表和仪表盘

### 文章列表 (/posts)

- 显示所有文章
- 链接到文章详情

### 文章详情 (/posts/:id)

- 显示单篇文章
- 动态路由参数

### 仪表盘 (/dashboard)

- 需要认证
- 显示用户信息

### 设置 (/dashboard/settings)

- 需要认证
- 用户设置页面

### API (/api/posts)

- GET - 获取所有文章
- POST - 创建新文章
- GET /:id - 获取单篇文章
- 需要认证

## 数据流

```
浏览器请求
    ↓
Express 服务器
    ↓
Vite 开发服务器 (dev) / 静态文件 (prod)
    ↓
entry-server.tsx (SSR)
    ↓
路由扫描器 → 生成路由
    ↓
中间件 → 认证/日志
    ↓
Loader 函数 → 数据获取
    ↓
SolidJS 渲染 → HTML
    ↓
浏览器水合 (hydrate)
    ↓
交互式页面
```

## 部署

### 构建

```bash
npm run build
```

### 生产运行

```bash
npm run preview
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 扩展示例

### 添加新功能

1. **创建页面**

   ```
   app/contact/page.tsx
   ```

2. **添加动态路由**

   ```
   app/blog/[slug]/page.tsx
   ```

3. **创建 API**

   ```
   app/api/comments/route.ts
   ```

4. **添加守卫**
   ```typescript
   // framework.config.ts
   guards: {
     "/admin/*": "./src/middleware/admin.ts"
   }
   ```

### 自定义中间件

```typescript
// middleware/cache.ts
import { createMiddleware } from "hono/factory";

export const cacheMiddleware = createMiddleware(async (c, next) => {
  const cacheKey = c.req.path;
  const cached = globalThis.cache?.get(cacheKey);

  if (cached) {
    return c.json(cached);
  }

  await next();

  const response = c.res.clone();
  const body = await response.text();
  globalThis.cache?.set(cacheKey, JSON.parse(body));
});
```

## 调试技巧

### 查看生成的路由

```bash
# 查看路由树
node -e "
const scanner = require('@leeforge/fusion').RouteScanner;
const s = new scanner({ appDir: './src/app' });
s.scan().then(r => console.log(JSON.stringify(r.routes, null, 2)))
"
```

### 检查中间件

```bash
# 查看中间件执行顺序
npm run dev -- --verbose
```

### 测试守卫

```typescript
// 临时禁用守卫
// framework.config.ts
guards: {
} // 清空所有守卫
```

## 性能优化

1. **启用缓存**

   ```typescript
   const scanner = new RouteScanner({
     appDir: "./app",
     cache: true,
   });
   ```

2. **使用懒加载**

   ```typescript
   const LazyComponent = lazy(() => import("./HeavyComponent"));
   ```

3. **优化数据获取**
   ```typescript
   export const loader = async ({ context }) => {
     return context.queryClient.fetchQuery({
       queryKey: ["posts"],
       queryFn: () => fetchPosts(),
       staleTime: 1000 * 60 * 5,
     });
   };
   ```

## 故障排除

### 路由不工作

1. 检查文件命名是否正确
2. 确认文件在 `src/app/` 目录
3. 运行 `npm run generate` 查看输出

### 认证失败

1. 检查 `ctx.user` 是否存在
2. 验证 token 格式
3. 查看中间件顺序

### 数据不显示

1. 检查 API 端点
2. 验证 loader 返回值
3. 查看浏览器控制台

## 学习资源

- [API 文档](../../docs/README.md)
- [使用指南](../../docs/GUIDE.md)
- [Leeforge Fusion 源码](https://github.com/your-org/leeforge-fusion)

---

**示例作者**: Leeforge Team  
**最后更新**: 2026-01-15
