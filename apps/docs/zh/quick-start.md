# 快速开始

> 5 分钟内开始使用 Leeforge Fusion。

## 📦 安装

### 前置要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install @leeforge/fusion @leeforge/fusion-cli solid-js @tanstack/solid-router @tanstack/solid-query
```

## 🚀 创建你的第一个应用

### 步骤 1: 创建新项目

```bash
# 使用基础模板创建新项目
npx leeforge init my-app

# 或使用特定模板
npx leeforge init my-blog --template blog
npx leeforge init my-dashboard --template dashboard
```

### 步骤 2: 安装依赖

```bash
cd my-app
npm install
```

### 步骤 3: 启动开发

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。如果端口 3000 被占用，会自动尝试 3001、3002 等。

## 🎯 你会获得什么

### 文件路由

在 `src/app/` 中创建文件，它们会自动成为路由：

```
src/app/
├── index.tsx       → /
├── about.tsx       → /about
├── blog/
│   ├── index.tsx   → /blog
│   ├── [id].tsx    → /blog/123
│   └── new.tsx     → /blog/new
```

### 自动布局

`layout.tsx` 文件包裹所有页面：

```tsx
// src/app/layout.tsx
export default function Layout({ children }) {
  return (
    <div>
      <header>...</header>
      <main>{children}</main> {/* 所有页面在这里渲染 */}
      <footer>...</footer>
    </div>
  );
}
```

### 错误边界

创建 `error.tsx` 用于错误处理：

```tsx
// src/app/error.tsx
export default function ErrorBoundary() {
  return <div>出错了</div>;
}
```

### 加载状态

创建 `loading.tsx` 用于加载指示器：

```tsx
// src/app/loading.tsx
export default function Loading() {
  return <div>加载中...</div>;
}
```

## 📝 下一步

### 添加博客页面

```bash
mkdir -p src/app/blog
```

```tsx
// src/app/blog/index.tsx
export default function Blog() {
  return (
    <div>
      <h1>博客</h1>
      <ul>
        <li>
          <a href="/blog/1">文章 1</a>
        </li>
        <li>
          <a href="/blog/2">文章 2</a>
        </li>
      </ul>
    </div>
  );
}
```

### 添加动态路由

```tsx
// src/app/blog/[id].tsx
export default function BlogPost() {
  return (
    <div>
      <h1>博客文章</h1>
      <p>这是一个动态路由！</p>
    </div>
  );
}
```

### 添加 API 路由

```bash
mkdir -p src/app/api/users
```

```tsx
// src/app/api/users/route.ts
export async function GET() {
  return Response.json({ users: ["Alice", "Bob"] });
}
```

### 添加中间件

```bash
mkdir -p src/middleware
```

```tsx
// src/middleware/auth.ts
import { createMiddleware } from "@leeforge/fusion/middleware";

export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }

  await next();
});
```

### 保护路由

```tsx
// src/app/dashboard/guards.ts
import { requireAuth } from "@leeforge/fusion/middleware";

export const guards = {
  "/dashboard/*": [requireAuth()],
};
```

## 🎨 自定义

### 添加 Tailwind CSS

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
            我的应用
          </a>
        </nav>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 部署到 Vercel

```bash
npm i -g vercel
vercel
```

### 部署到 Netlify

```bash
npm i -g netlify
netlify deploy --prod
```

## 📚 学习更多

- [核心概念](/zh/core-concepts) - 理解框架架构
- [CLI 参考](/zh/cli) - 所有 CLI 命令
- [API 参考](/zh/api) - 完整 API 文档
- [示例](/zh/examples) - 实际案例

## 🎯 你已准备就绪！

你现在拥有一个可工作的 Leeforge Fusion 应用，包含：

- ✅ 文件式路由
- ✅ 布局和错误边界
- ✅ API 路由
- ✅ 中间件支持
- ✅ 热模块替换
- ✅ 自动端口检测

**编码愉快！** 🚀
