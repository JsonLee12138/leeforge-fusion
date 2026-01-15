# Leeforge Fusion - 使用指南

## 快速开始

### 1. 安装

```bash
npm install @leeforge/fusion
```

### 2. 项目结构

```
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/
│       └── posts/
│           └── route.ts
├── framework.config.ts
└── package.json
```

### 3. 配置

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
    },
  },
});
```

### 4. 运行

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 路由系统

### 文件约定

| 文件类型          | 用途       | 路由路径 |
| ----------------- | ---------- | -------- |
| `page.tsx`        | 页面组件   | `/path`  |
| `page.server.tsx` | 服务端组件 | `/path`  |
| `layout.tsx`      | 布局组件   | `/path`  |
| `route.ts`        | API 路由   | `/path`  |

### 动态路由

```
app/
└── posts/
    └── [id]/
        └── page.tsx
```

生成路由: `/posts/:id`

### 路由组

```
app/
└── (dashboard)/
    ├── page.tsx
    └── settings/
        └── page.tsx
```

生成路由: `/dashboard`, `/dashboard/settings`

### 嵌套路由

```
app/
├── page.tsx              # /
├── posts/
│   ├── page.tsx          # /posts
│   └── [id]/
│       └── page.tsx      # /posts/:id
```

## 中间件

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

### 组合中间件

```typescript
import { composeMiddleware } from "@leeforge/fusion";

const middleware = composeMiddleware([
  loggerMiddleware,
  corsMiddleware,
  errorMiddleware,
]);

app.use(middleware);
```

## 路由守卫

### 基本守卫

```typescript
// middleware/auth.ts
import { defineGuard, redirect } from "@leeforge/fusion";

export const requireAuth = defineGuard((ctx) => {
  if (!ctx.user) {
    throw redirect("/login");
  }
});
```

### 守卫链

```typescript
import { createGuardChain, requireAuth, requireAdmin } from "@leeforge/fusion";

const adminChain = createGuardChain(requireAuth, requireAdmin);

// 在 loader 中使用
export const loader = async ({ context }) => {
  await adminChain(context);
  return { data: "..." };
};
```

### 自定义守卫

```typescript
export const requirePremium = defineGuard((ctx) => {
  if (!ctx.user?.subscription !== "premium") {
    throw redirect("/upgrade");
  }
});
```

## SSR 上下文

### 创建上下文

```typescript
import { SSRContextManager } from "@leeforge/fusion";

const context = SSRContextManager.createContext({
  request: new Request("http://localhost"),
  user: { id: "123", name: "John" },
  API_BASE: "/api",
});
```

### 在 Loader 中使用

```typescript
export const loader = async ({ context }) => {
  const data = await fetch(`${context.API_BASE}/posts`, {
    headers: {
      Authorization: `Bearer ${context.user?.token}`,
    },
  });
  return { posts: await data.json() };
};
```

## 数据获取

### 使用 Query Client

```typescript
import { QueryClient } from "@tanstack/solid-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
```

### 在 Loader 中获取数据

```typescript
export const loader = async ({ params, context }) => {
  const post = await context.queryClient.fetchQuery({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const res = await fetch(`${context.API_BASE}/posts/${params.id}`);
      return res.json();
    },
  });
  return { post };
};
```

## 错误处理

### 重定向

```typescript
import { redirect } from "@leeforge/fusion";

export const loader = async ({ context }) => {
  if (!context.user) {
    throw redirect("/login");
  }
  return { data: "..." };
};
```

### 错误边界

```typescript
export const ErrorBoundary = ({ error, reset }) => {
  if (isRedirectError(error)) {
    // 重定向错误
    return null;
  }

  return (
    <div>
      <h1>Error</h1>
      <button onClick={reset}>Retry</button>
    </div>
  );
};
```

## 高级用法

### 自定义生成器

```typescript
import { RouteGenerator } from "@leeforge/fusion";

const generator = new RouteGenerator({
  outputDir: "./.framework/routes",
});

// 自定义模板
generator.generateClientRouteFile = (route) => {
  // 自定义生成逻辑
  return `...`;
};
```

### 插件系统

```typescript
// framework.config.ts
export default defineConfig({
  plugins: [myPlugin(), anotherPlugin()],
});
```

### 性能优化

```typescript
// 使用缓存
const scanner = new RouteScanner({
  appDir: "./app",
  cache: true, // 启用缓存
});

// 增量生成
const result = await scanner.scan();
if (result.conflicts.length === 0) {
  await generator.generate(result.routes);
}
```

## 最佳实践

### 1. 路由组织

```
app/
├── (public)/          # 公共页面
│   ├── page.tsx
│   └── about/
│       └── page.tsx
├── (auth)/           # 需要登录
│   ├── dashboard/
│   └── settings/
└── (admin)/          # 需要管理员
    └── users/
```

### 2. 中间件顺序

```typescript
// 正确顺序
app.use(corsMiddleware); // 1. CORS
app.use(loggerMiddleware); // 2. 日志
app.use(authMiddleware); // 3. 认证
app.use(errorMiddleware); // 4. 错误处理
```

### 3. 守卫复用

```typescript
// middleware/guards.ts
export const requireAuth = defineGuard(...);
export const requireAdmin = defineGuard(...);
export const requirePremium = defineGuard(...);

// 复用守卫链
export const adminChain = createGuardChain(requireAuth, requireAdmin);
export const premiumChain = createGuardChain(requireAuth, requirePremium);
```

### 4. 类型安全

```typescript
// 定义用户类型
interface User {
  id: string;
  role: "user" | "admin" | "premium";
}

// 在上下文中使用
interface AppContext {
  user?: User;
  // ...
}

// 守卫中使用
export const requireAdmin = defineGuard((ctx: AppContext) => {
  if (ctx.user?.role !== "admin") {
    throw redirect("/unauthorized");
  }
});
```

## 调试

### 启用详细日志

```typescript
const scanner = new RouteScanner({
  appDir: "./app",
  cache: false, // 禁用缓存以便调试
});

const result = await scanner.scan();
console.log("Routes:", result.routes);
console.log("Conflicts:", result.conflicts);
```

### 检查生成的代码

```bash
# 查看生成的路由文件
cat .framework/routes/posts/[id].ts

# 查看客户端入口
cat .framework/routes/client-entry.ts

# 查看路由清单
cat .framework/routes/manifest.json
```

## 部署

### 构建

```bash
npm run build
```

### 环境变量

```bash
# .env.production
VITE_API_BASE=https://api.example.com
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

## 故障排除

### 路由不工作

1. 检查文件命名是否正确
2. 确认文件在 app/ 目录
3. 运行 `npm run dev` 查看错误

### 守卫不生效

1. 确保抛出 `redirect()` 异常
2. 检查上下文中的 user 数据
3. 验证守卫链顺序

### 生成错误

1. 检查路由树: `console.log(result.routes)`
2. 查看冲突: `console.log(result.conflicts)`
3. 清理缓存: `rm -rf .framework`

---

**需要帮助？** 查看 [API 文档](./README.md) 或 [GitHub Issues](https://github.com/your-org/leeforge-fusion/issues)
