# Leeforge Fusion 全栈 SSR Demo

这是一个使用 Leeforge Fusion 框架构建的全栈 SSR 应用示例。项目包含 5 个页面和完整的 mock API 后端。

## 🚀 项目特性

- **SSR 渲染**: 服务器端渲染，提供更好的 SEO 和首屏加载速度
- **文件路由**: 基于文件系统的自动路由
- **Mock API**: 完整的后端 API 模拟，无需数据库
- **类型安全**: 完整的 TypeScript 支持
- **现代化 UI**: 精心设计的样式和交互体验

## 📁 项目结构

```
demo-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── index.tsx           # 首页 (/)
│   │   ├── about.tsx           # 关于页面 (/about)
│   │   ├── products/
│   │   │   ├── index.tsx       # 产品列表 (/products)
│   │   │   └── [id]/
│   │   │       └── index.tsx   # 产品详情 (/products/:id)
│   │   ├── contact/
│   │   │   └── index.tsx       # 联系页面 (/contact)
│   │   └── api/
│   │       └── products/
│   │           ├── route.ts    # 产品 API (/api/products)
│   │           └── [id]/
│   │               └── route.ts # 产品详情 API (/api/products/:id)
│   └── styles/
│       └── global.css          # 全局样式
├── leeforge.config.ts          # 框架配置
├── package.json
└── tsconfig.json
```

## 📄 页面说明

### 1. 首页 (`/`)

- 欢迎页面，介绍 Leeforge Fusion 框架
- 展示核心特性列表
- 快速导航到其他页面

### 2. 关于页面 (`/about`)

- 框架介绍和使用说明
- 技术栈详情

### 3. 产品列表 (`/products`)

- 展示 6 个模拟产品
- 使用 SSR 数据加载
- 网格布局展示产品卡片
- 点击跳转到产品详情

### 4. 产品详情 (`/products/:id`)

- 动态路由参数
- 展示产品详细信息
- 功能特性列表
- 模拟购买按钮

### 5. 联系页面 (`/contact`)

- 联系信息展示（邮箱、电话、地址）
- 联系表单
- 表单验证和提交状态
- 模拟后端提交

## 🔌 API 接口

### GET /api/products

获取所有产品列表

**响应示例:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Leeforge Fusion 框架",
      "price": 999,
      "description": "现代化的全栈 SSR 框架...",
      "category": "框架"
    }
  ],
  "count": 6,
  "timestamp": "2025-01-16T10:00:00.000Z"
}
```

### GET /api/products/:id

获取单个产品详情

**响应示例:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Leeforge Fusion 框架",
    "price": 999,
    "description": "现代化的全栈 SSR 框架...",
    "category": "框架",
    "features": ["文件-based 路由", "SSR 支持", "中间件系统", "类型安全"]
  },
  "timestamp": "2025-01-16T10:00:00.000Z"
}
```

### POST /api/products

创建新产品

**请求体:**

```json
{
  "name": "新产品名称",
  "price": 999,
  "description": "产品描述",
  "category": "分类"
}
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "新产品名称",
    "price": 999,
    "description": "产品描述",
    "category": "分类",
    "createdAt": "2025-01-16T10:00:00.000Z"
  },
  "message": "产品创建成功"
}
```

### PUT /api/products/:id

更新产品信息

### DELETE /api/products/:id

删除产品

## 🚀 运行项目

### 安装依赖

```bash
cd demo-app
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 生产构建

```bash
npm run build
npm run preview
```

### 类型检查

```bash
npm run typecheck
```

## 🎯 技术栈

- **前端框架**: Solid.js
- **全栈框架**: Leeforge Fusion
- **路由**: TanStack Router
- **数据获取**: TanStack Query
- **构建工具**: Vite
- **类型检查**: TypeScript

## 📝 开发说明

### 添加新页面

1. 在 `src/app/` 目录下创建新的 `.tsx` 文件
2. 文件名即为路由路径（支持动态路由 `[id].tsx`）
3. 自动路由，无需手动配置

### 添加 API 路由

1. 在 `src/app/api/` 目录下创建 `route.ts` 文件
2. 导出 GET、POST、PUT、DELETE 等方法
3. API 路径自动映射到文件路径

### 样式系统

- 使用 CSS 类名（支持 Tailwind 风格）
- 全局样式在 `src/styles/global.css`
- 组件样式直接在 JSX 中使用 `className`

## 🔧 配置说明

### leeforge.config.ts

```typescript
export default defineConfig({
  api: {
    prefix: "/api", // API 路由前缀
    timeout: 5000, // 请求超时时间
  },
  ssr: {
    render: "stream", // SSR 渲染模式
    timeout: 10000, // SSR 超时时间
  },
  vite: {
    server: {
      port: 3000, // 开发服务器端口
    },
  },
});
```

## 🐛 常见问题

### 1. 端口被占用

修改 `leeforge.config.ts` 中的端口号：

```typescript
vite: {
  server: {
    port: 3001,  // 改为其他端口
  },
}
```

### 2. 类型错误

运行类型检查：

```bash
npm run typecheck
```

### 3. 构建失败

确保所有依赖已安装：

```bash
npm install
```

## 📚 学习资源

- [Leeforge Fusion 文档](https://github.com/JsonLee12138/leeforge-fusion)
- [Solid.js 官方文档](https://www.solidjs.com/)
- [TanStack Router 文档](https://tanstack.com/router)
- [TanStack Query 文档](https://tanstack.com/query)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
