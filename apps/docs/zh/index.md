---
layout: home

hero:
  name: "Leeforge Fusion"
  text: "面向 Solid.js 的现代化全栈框架"
  tagline: 文件路由、中间件、服务器动作和 SSR - 一切尽在一个框架中
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/quick-start
    - theme: alt
      text: 查看示例
      link: /zh/examples
    - theme: alt
      text: GitHub
      link: https://github.com/JsonLee12138/leeforge-fusion

features:
  - title: 🚀 文件路由
    details: 从文件结构自动生成路由，无需配置。
  - title: 🔒 中间件系统
    details: 基于 Hono 的中间件，支持认证、日志、CORS 等。
  - title: ⚡ 服务器动作
    details: 客户端与服务器之间的类型安全 RPC，无需手动调用 API。
  - title: 🎨 SSR 就绪
    details: 服务器端渲染，无缝客户端水合。
  - title: 🔧 零配置
    details: 开箱即用，提供合理的默认配置，可按需自定义。
  - title: 📦 TypeScript 优先
    details: 全栈 TypeScript 支持，默认类型安全。
---

# Leeforge Fusion 文档

> 面向 Solid.js 的现代化全栈框架，提供文件路由、中间件和服务器动作。

## 🚀 快速开始

### 安装

```bash
npm install @leeforge/fusion @leeforge/fusion-cli solid-js @tanstack/solid-router @tanstack/solid-query
```

### 创建你的第一个应用

```bash
# 创建项目结构
mkdir my-app && cd my-app
mkdir -p src/app src/middleware

# 创建入口文件
touch src/app/layout.tsx
touch src/app/index.tsx
touch leeforge.config.ts
```

### 项目结构

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── index.tsx       # 首页 (/)
│   │   ├── about.tsx       # 关于页 (/about)
│   │   ├── blog/
│   │   │   ├── index.tsx   # 博客列表 (/blog)
│   │   │   ├── [id].tsx    # 博客文章 (/blog/123)
│   │   │   └── new.tsx     # 新文章 (/blog/new)
│   │   └── api/
│   │       └── users/
│   │           └── route.ts # API 端点
│   ├── middleware/
│   │   └── auth.ts         # 认证中间件
│   └── entry-server.tsx    # 服务器入口 (可选)
│
├── leeforge.config.ts      # 框架配置
├── package.json
└── tsconfig.json
```

### 配置

#### leeforge.config.ts

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  guards: {
    "/dashboard/*": "./src/middleware/auth.ts",
    "/admin/*": "./src/middleware/auth.ts",
  },
  api: {
    prefix: "/api",
  },
  vite: {
    server: {
      port: 3000,
    },
  },
});
```

### 开发

```bash
# 启动开发服务器
npx leeforge dev --port 3000

# 服务器会自动查找可用端口
# 如果指定端口被占用
```

### 构建与预览

```bash
# 构建生产版本
npx leeforge build

# 预览生产构建
npx leeforge preview
```

## 📚 核心概念

### 文件路由

Leeforge Fusion 从 `src/app/` 目录自动生成路由：

| 文件                       | 路由                  |
| -------------------------- | --------------------- |
| `index.tsx`                | `/`                   |
| `about.tsx`                | `/about`              |
| `blog/index.tsx`           | `/blog`               |
| `blog/[id].tsx`            | `/blog/:id`           |
| `blog/new.tsx`             | `/blog/new`           |
| `(dashboard)/settings.tsx` | `/dashboard/settings` |

### 路由文件

#### 页面组件

```tsx
// src/app/blog/[id].tsx
import { createSignal } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function BlogPost() {
  const [count, setCount] = createSignal(0);

  const post = createServerData(async ({ params }) => {
    // 在服务器端获取数据
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    return res.json();
  });

  return (
    <div>
      <h1>{post().title}</h1>
      <p>{post().content}</p>
      <button onClick={() => setCount((c) => c + 1)}>计数: {count()}</button>
    </div>
  );
}

// 可选：数据加载器
export const loader = async ({ params, queryClient }) => {
  // 在渲染前预取数据
  return { post: await fetchPost(params.id) };
};

// 可选：路由守卫
export const guards = [requireAuth()];
```

#### API 路由

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

### 布局

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
          <a href="/">首页</a>
          <a href="/about">关于</a>
          <a href="/blog">博客</a>
        </nav>
      </header>
      <main>{props.children}</main>
      <footer>
        <p>© 2026 我的应用</p>
      </footer>
    </div>
  );
}
```

### 错误边界

```tsx
// src/app/error.tsx
import { useRouteError } from "@tanstack/solid-router";

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div class="error-page">
      <h1>出错了</h1>
      <p>{error?.message || "未知错误"}</p>
      <a href="/">返回首页</a>
    </div>
  );
}
```

### 加载状态

```tsx
// src/app/loading.tsx
export default function Loading() {
  return (
    <div class="loading-page">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
  );
}
```

### 中间件

```tsx
// src/middleware/auth.ts
import { createMiddleware } from "@leeforge/fusion/middleware";

export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }

  const user = await validateToken(token);
  ctx.set("user", user);

  await next();
});

export const requireAdmin = createMiddleware(async (ctx, next) => {
  const user = ctx.get("user");

  if (!user || user.role !== "admin") {
    return Response.json({ error: "禁止访问" }, { status: 403 });
  }

  await next();
});
```

### 路由守卫

```tsx
// src/app/admin/guards.ts
import { requireAuth, requireAdmin } from "@leeforge/fusion/middleware";

export const guards = {
  "/admin/*": "./src/middleware/auth.ts",
  "/dashboard/*": "./src/middleware/auth.ts",
};
```

### 服务器动作

```tsx
// src/app/blog/new.tsx
import { useServerAction } from "@leeforge/fusion/client";

export async function createPost(data: { title: string; content: string }) {
  // 服务器端代码
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
      alert("文章已创建！");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="标题" />
      <textarea name="content" placeholder="内容" />
      <button disabled={loading}>{loading ? "创建中..." : "创建文章"}</button>
      {error && <div class="error">{error.message}</div>}
    </form>
  );
}
```

## 🔧 CLI 命令

### `leeforge dev`

启动开发服务器。

```bash
leeforge dev --port 3000
```

**选项：**

- `--port <number>` - 监听端口（默认：3000）
- 如果指定端口被占用，服务器会自动查找可用端口

**特性：**

- 自动端口检测
- 热模块替换 (HMR)
- 错误覆盖层
- 路由可视化

### `leeforge build`

构建生产版本。

```bash
leeforge build
```

**输出：**

- `dist/client/` - 客户端 bundle
- `dist/server/` - 服务器端 bundle

### `leeforge generate`

生成代码脚手架。

```bash
# 生成页面
leeforge generate page blog/[slug]

# 生成 API 路由
leeforge generate api users/[id]

# 生成组件
leeforge generate component Button

# 预览而不创建文件
leeforge generate page about --dry-run
```

## 🎨 配置

### leeforge.config.ts

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  // 路由守卫
  guards: {
    "/dashboard/*": "./src/middleware/auth.ts",
    "/admin/*": "./src/middleware/auth.ts",
  },

  // API 配置
  api: {
    prefix: "/api",
    timeout: 5000,
  },

  // SSR 配置
  ssr: {
    render: "stream", // 或 "static"
    timeout: 10000,
  },

  // Vite 配置（合并框架默认值）
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

## 🛡️ 安全

### 认证

```typescript
// src/middleware/auth.ts
export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }

  // 验证令牌
  const user = await validateToken(token);
  ctx.set("user", user);

  await next();
});
```

### 授权

```typescript
// src/middleware/auth.ts
export const requireAdmin = createMiddleware(async (ctx, next) => {
  const user = ctx.get("user");

  if (!user || user.role !== "admin") {
    return Response.json({ error: "禁止访问" }, { status: 403 });
  }

  await next();
});
```

### 输入验证

```typescript
// src/app/api/users/route.ts
export async function POST({ request }) {
  const data = await request.json();

  // 验证输入
  if (!data.email || !data.password) {
    return Response.json({ error: "缺少必填字段" }, { status: 400 });
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return Response.json({ error: "邮箱格式无效" }, { status: 400 });
  }

  // 创建用户
  const user = await db.users.create(data);
  return Response.json(user, { status: 201 });
}
```

## 🧪 测试

### 单元测试

```bash
npm test
```

### 集成测试

```bash
npm run test:integration
```

### E2E 测试

```bash
npm run test:e2e
```

## 📦 部署

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Netlify

```bash
# 安装 Netlify CLI
npm i -g netlify

# 部署
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

## 🎯 最佳实践

### 1. 保持组件小巧

```tsx
// ✅ 好 - 小巧、专注的组件
export function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ 差 - 大型、单体组件
export function HugeComponent() {
  // 500 行代码
}
```

### 2. 使用服务器数据加载

```tsx
// ✅ 好 - 服务器端数据加载
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

// ❌ 差 - 客户端数据加载（较慢）
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

### 3. 使用路由守卫

```tsx
// ✅ 好 - 受保护的路由
export const guards = [requireAuth()];

// ❌ 差 - 无保护
// 未导出 guards
```

### 4. 优雅地处理错误

```tsx
// ✅ 好 - 错误边界
export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div>
      <h1>错误</h1>
      <p>{error?.message}</p>
    </div>
  );
}

// ❌ 差 - 无错误处理
export default function Page() {
  // 无错误处理
}
```

## 📚 API 参考

### 核心导出

#### `startDevServer(options)`

启动开发服务器。

```typescript
import { startDevServer } from "@leeforge/fusion";

await startDevServer({
  port: 3000,
  appDir: "src/app",
  rootDir: process.cwd(),
});
```

#### `RouteScanner`

从目录扫描路由。

```typescript
import { RouteScanner } from "@leeforge/fusion";

const scanner = new RouteScanner({ appDir: "src/app" });
const result = await scanner.scan();
```

#### `RouteGenerator`

生成路由文件。

```typescript
import { RouteGenerator } from "@leeforge/fusion";

const generator = new RouteGenerator({ outputDir: ".generated" });
await generator.generate(routes);
```

#### `createMiddleware`

创建中间件。

```typescript
import { createMiddleware } from "@leeforge/fusion/middleware";

export const myMiddleware = createMiddleware(async (ctx, next) => {
  // 之前
  await next();
  // 之后
});
```

#### `createServerData`

创建服务器端数据加载器。

```typescript
import { createServerData } from "@leeforge/fusion/data";

const data = createServerData(async ({ params, queryClient }) => {
  return await fetchData(params.id);
});
```

#### `useServerAction`

在客户端使用服务器动作。

```typescript
import { useServerAction } from "@leeforge/fusion/client";

const [action, { loading, error }] = useServerAction(myAction);
```

## 🎓 示例

### 博客应用

查看完整示例：`apps/demo/`

### Todo 应用

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
      <h1>Todo 应用</h1>
      <form onSubmit={handleAdd}>
        <input name="text" placeholder="添加 todo..." />
        <button disabled={loading}>{loading ? "添加中..." : "添加"}</button>
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

### 认证流程

```tsx
// src/middleware/auth.ts
export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "未授权" }, { status: 401 });
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
    return Response.json({ error: "凭证无效" }, { status: 401 });
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
      <h1>欢迎, {user().name}</h1>
    </div>
  );
}
```

## 🚨 故障排除

### 端口已被占用

开发服务器会自动查找可用端口：

```bash
$ leeforge dev --port 3000
⚠️  端口 3000 已被占用，尝试 3001...
🚀 Leeforge 开发服务器运行在 http://localhost:3001
```

### 模块未找到

确保所有依赖已安装：

```bash
npm install @leeforge/fusion @leeforge/fusion-cli solid-js @tanstack/solid-router @tanstack/solid-query
```

### TypeScript 错误

检查你的 `tsconfig.json`：

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

## 📞 支持

- **GitHub Issues**: https://github.com/JsonLee12138/leeforge-fusion/issues
- **讨论区**: https://github.com/JsonLee12138/leeforge-fusion/discussions
- **文档**: https://github.com/JsonLee12138/leeforge-fusion/tree/main/apps/docs

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](https://github.com/JsonLee12138/leeforge-fusion/blob/main/LICENSE)

---

**使用 Leeforge Fusion 构建** ❤️
