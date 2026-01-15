# Leeforge Fusion - API 文档

## 概述

Leeforge Fusion 是一个基于 SolidJS 和 TanStack Router 的全栈 React 框架，提供路由扫描、代码生成、中间件系统等功能。

## 核心模块

### 1. 路由系统 (`@/router`)

#### RouteScanner

扫描 `app/` 目录并生成路由树。

```typescript
import { RouteScanner } from "@leeforge/fusion";

const scanner = new RouteScanner({
  appDir: "./app",
  ignore: ["**/test/**"],
  cache: true,
});

const result = await scanner.scan();
// result.routes - 路由树
// result.conflicts - 路由冲突
```

**支持的文件约定**:

- `page.tsx` - 页面组件
- `page.server.tsx` - 服务端组件
- `layout.tsx` - 布局组件
- `route.ts` - API 路由

**路由模式**:

- `/posts/[id]/page.tsx` → `/posts/:id`
- `/(dashboard)/page.tsx` → `/dashboard`
- `/api/posts/route.ts` → `/api/posts`

#### RouteGenerator

生成 TanStack Router 兼容的客户端代码。

```typescript
import { RouteGenerator } from "@leeforge/fusion";

const generator = new RouteGenerator({
  outputDir: "./.framework/routes",
});

const { clientRoutes, manifest } = await generator.generate(routes);
```

#### 工具函数

```typescript
import {
  formatRoutePath,
  isDynamicRoute,
  getRouteDepth,
  findRouteByPath,
  flattenRoutes,
} from "@leeforge/fusion/router/utils";

formatRoutePath("/posts//page"); // "/posts/page"
isDynamicRoute("/posts/:id"); // true
```

### 2. 配置系统 (`@/config`)

#### RouteConfigManager

管理路由配置。

```typescript
import { RouteConfigManager } from "@leeforge/fusion";

const config = new RouteConfigManager({
  base: "/app",
  trailingSlash: "never",
  groups: {
    "(dashboard)": "/dashboard",
    "(admin)": "/admin",
  },
  guards: {
    "/admin/*": "./middleware/auth.ts",
    "/dashboard/*": "./middleware/dashboard.ts",
  },
  ignore: ["**/test/**"],
});

config.getGroupPath("(dashboard)"); // "/dashboard"
config.shouldIgnore("/test/page"); // true
config.getGuard("/admin/users"); // "./middleware/auth.ts"
```

**配置选项**:

- `base` - 基础路径 (默认: "/")
- `trailingSlash` - 尾部斜杠处理 ("never" | "always")
- `groups` - 路由组映射
- `guards` - 路由守卫映射
- `ignore` - 忽略的文件/目录

### 3. 中间件系统 (`@/middleware`)

#### Hono 中间件

```typescript
import {
  authMiddleware,
  loggerMiddleware,
  errorMiddleware,
  corsMiddleware,
  composeMiddleware,
} from "@leeforge/fusion";

// 单个中间件
app.use(authMiddleware);

// 组合中间件
const middleware = composeMiddleware([
  loggerMiddleware,
  corsMiddleware,
  errorMiddleware,
]);
app.use(middleware);
```

**中间件类型**:

- `authMiddleware` - 认证检查
- `loggerMiddleware` - 请求日志
- `errorMiddleware` - 错误处理
- `corsMiddleware` - CORS 支持

#### 路由守卫

```typescript
import {
  defineGuard,
  requireAuth,
  requireAdmin,
  requireGuest,
  createGuardChain,
} from "@leeforge/fusion";

// 自定义守卫
const requirePremium = defineGuard((ctx) => {
  if (!ctx.user?.isPremium) {
    throw redirect("/upgrade");
  }
});

// 守卫链
const authChain = createGuardChain(requireAuth, requireAdmin, requirePremium);

// 在路由中使用
export const loader = async ({ context }) => {
  await authChain(context);
  return { data: "..." };
};
```

#### 重定向

```typescript
import { redirect, isRedirectError } from "@leeforge/fusion";

try {
  if (!user) {
    throw redirect("/login");
  }
} catch (error) {
  if (isRedirectError(error)) {
    // 处理重定向
    const location = getRedirectLocation(error);
    const status = getRedirectStatus(error);
  }
}
```

### 4. SSR 上下文 (`@/ssr`)

```typescript
import { SSRContextManager } from "@leeforge/fusion";

// 创建上下文
const context = SSRContextManager.createContext({
  request: new Request("http://localhost"),
  user: { id: "123", name: "John" },
  API_BASE: "/api",
});

// 从 Hono 上下文创建
const context = SSRContextManager.fromHonoContext(c);

// 扩展上下文
const extended = SSRContextManager.extend(context, {
  customData: "value",
});
```

## 使用示例

### 基本路由结构

```
app/
├── layout.tsx
├── page.tsx
├── posts/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
└── api/
    └── posts/
        └── route.ts
```

### 配置文件

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

### 中间件示例

```typescript
// middleware/auth.ts
import { defineGuard, redirect } from "@leeforge/fusion";

export const requireAuth = defineGuard((ctx) => {
  if (!ctx.user) {
    throw redirect("/login");
  }
});
```

### 页面组件

```typescript
// app/posts/[id]/page.tsx
import { Route } from "./.framework/routes/posts/$id";

export default function PostPage() {
  const { post } = Route.useLoaderData();
  return <div>{post.title}</div>;
}
```

## 类型定义

### Route

```typescript
interface Route {
  path: string; // "/posts/:id"
  file: string; // "posts/[id]/page.tsx"
  type: "page" | "layout" | "api" | "server";
  params: string[]; // ["id"]
  children?: Route[];
  componentName?: string; // "PostsIdPage"
  importName?: string; // "posts__id__page"
}
```

### ScannerConfig

```typescript
interface ScannerConfig {
  appDir: string; // "./app"
  ignore?: string[]; // ["**/test/**"]
  cache?: boolean; // true
}
```

### RouteConfig

```typescript
interface RouteConfig {
  base?: string;
  trailingSlash?: "never" | "always";
  groups?: Record<string, string>;
  guards?: Record<string, string>;
  ignore?: string[];
}
```

### Context

```typescript
interface AppContext {
  request: Request;
  user?: User;
  API_BASE: string;
  queryClient: QueryClient;
}
```

## 最佳实践

1. **路由组织**: 使用路由组组织相关页面
2. **守卫复用**: 创建可复用的守卫函数
3. **错误处理**: 使用重定向系统处理错误
4. **类型安全**: 利用 TypeScript 类型推断
5. **性能优化**: 使用缓存和增量扫描

## 故障排除

### 常见问题

**路由不被识别**

- 检查文件命名是否符合约定
- 确认文件在 app/ 目录下
- 检查 ignore 配置

**守卫不工作**

- 确保守卫抛出 redirect 异常
- 检查上下文中的 user 数据
- 验证守卫链顺序

**生成代码错误**

- 检查路由树是否正确
- 验证导入路径
- 查看 manifest 生成

## API 参考

### RouteScanner

| 方法     | 返回                  | 描述             |
| -------- | --------------------- | ---------------- |
| `scan()` | `Promise<ScanResult>` | 扫描并返回路由树 |

### RouteGenerator

| 方法               | 返回                                  | 描述           |
| ------------------ | ------------------------------------- | -------------- |
| `generate(routes)` | `Promise<{ clientRoutes, manifest }>` | 生成客户端代码 |

### RouteConfigManager

| 方法                  | 返回                  | 描述         |
| --------------------- | --------------------- | ------------ |
| `getGroupPath(group)` | `string \| undefined` | 获取组路径   |
| `shouldIgnore(path)`  | `boolean`             | 检查是否忽略 |
| `getGuard(path)`      | `string \| undefined` | 获取守卫路径 |
| `getConfig()`         | `ResolvedRouteConfig` | 获取配置     |

### 中间件

| 函数                | 类型                           | 描述        |
| ------------------- | ------------------------------ | ----------- |
| `authMiddleware`    | `Middleware`                   | 认证中间件  |
| `loggerMiddleware`  | `Middleware`                   | 日志中间件  |
| `errorMiddleware`   | `Middleware`                   | 错误中间件  |
| `corsMiddleware`    | `Middleware`                   | CORS 中间件 |
| `composeMiddleware` | `(Middleware[]) => Middleware` | 组合中间件  |

### 守卫

| 函数               | 类型                           | 描述       |
| ------------------ | ------------------------------ | ---------- |
| `defineGuard`      | `(fn) => GuardFunction`        | 创建守卫   |
| `requireAuth`      | `GuardFunction`                | 需要登录   |
| `requireAdmin`     | `GuardFunction`                | 需要管理员 |
| `requireGuest`     | `GuardFunction`                | 需要访客   |
| `createGuardChain` | `(...guards) => GuardFunction` | 守卫链     |

### 重定向

| 函数                       | 返回      | 描述               |
| -------------------------- | --------- | ------------------ |
| `redirect(to, status?)`    | `never`   | 抛出重定向         |
| `isRedirectError(error)`   | `boolean` | 检查是否重定向错误 |
| `getRedirectLocation(err)` | `string`  | 获取重定向位置     |
| `getRedirectStatus(err)`   | `number`  | 获取状态码         |

---

**版本**: 0.1.0  
**最后更新**: 2026-01-15
