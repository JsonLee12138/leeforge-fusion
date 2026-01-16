# Leeforge Fusion - 文档索引

## 📚 文档导航

### 🚀 快速开始

- **[快速开始](./GUIDE.md#快速开始)** - 5 分钟上手
- **[项目结构](./GUIDE.md#项目结构)** - 了解目录组织
- **[第一个应用](./USAGE.md#快速开始)** - 创建你的第一个应用

### 📖 核心概念

#### 路由系统

- **[路由约定](./README.md#路由系统)** - 文件命名和结构
- **[动态路由](./USAGE.md#路由系统)** - `[id]` 参数处理
- **[路由组](./README.md#路由系统)** - `(dashboard)` 分组
- **[嵌套路由](./USAGE.md#路由系统)** - 父子路由关系

#### 中间件和守卫

- **[中间件](./README.md#中间件系统)** - 认证、日志、错误处理
- **[路由守卫](./README.md#路由守卫)** - 访问控制
- **[重定向](./README.md#重定向)** - 页面跳转

#### 数据层

- **[Query Client](./README.md#数据获取)** - 数据缓存
- **[Loader 函数](./USAGE.md#数据获取)** - 数据加载
- **[API 调用](./USAGE.md#API路由)** - 类型安全的 fetch

#### SSR 渲染

- **[SSR 原理](./README.md#SSR上下文)** - 服务端渲染流程
- **[状态水合](./README.md#SSR上下文)** - 客户端恢复
- **[性能优化](./USAGE.md#性能优化)** - 渲染优化

### 🛠️ 工具和 CLI

#### CLI 命令

```bash
# 开发
leeforge dev --port 3000

# 构建
leeforge build

# 生成代码
leeforge generate page posts/list
leeforge generate api users/[id]
leeforge generate component Button

# 预览
leeforge preview
```

**详细文档**: [CLI 使用](./USAGE.md#CLI工具)

#### Vite 插件

- 自动路由生成
- 热重载支持
- 模块解析

**详细文档**: [Vite 集成](./README.md#Vite插件)

### 📝 代码示例

#### 基础示例

```typescript
// app/page.tsx
export default function Home() {
  return <h1>Welcome</h1>;
}
```

#### 带数据加载

```typescript
// app/posts/[id]/page.tsx
export const loader = async ({ params }) => {
  const post = await fetch(`/api/posts/${params.id}`).then(r => r.json());
  return { post };
};

export default function Post() {
  const { post } = Route.useLoaderData();
  return <article>{post.title}</article>;
}
```

#### 带守卫

```typescript
// app/dashboard/page.tsx
import { requireAuth } from "../middleware/auth";

export const loader = async ({ context }) => {
  await requireAuth(context);
  return { data: "..." };
};
```

#### API 路由

```typescript
// app/api/posts/route.ts
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

### 🔧 配置

#### 框架配置

```typescript
// leeforge.config.ts
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  routes: {
    base: "/",
    trailingSlash: "never",
    groups: { "(dashboard)": "/dashboard" },
    guards: { "/admin/*": "./middleware/auth.ts" },
    ignore: ["**/*.spec.ts"],
  },
  vite: {
    server: {
      port: 3000,
    },
  },
});
```

      appDir: "./app",
      apiDir: "./app/api",
    }),

],
});

````

### 🎯 最佳实践

#### 性能优化

1. **启用缓存**: `cache: true`
2. **懒加载**: 使用 `lazy()` 和 `Suspense`
3. **数据缓存**: 设置合适的 `staleTime`
4. **图片优化**: WebP + 懒加载

#### 安全实践

1. **输入验证**: 验证所有 API 输入
2. **认证检查**: 使用路由守卫
3. **CORS**: 正确配置跨域
4. **错误处理**: 不泄露敏感信息

#### 代码组织

1. **模块化**: 单一职责原则
2. **类型安全**: 完整的 TypeScript 类型
3. **测试覆盖**: 核心功能必须测试
4. **文档**: 公共 API 必须有 JSDoc

### 🐛 故障排除

#### 常见问题

- [路由不工作](./USAGE.md#常见问题)
- [守卫不生效](./USAGE.md#常见问题)
- [数据不显示](./USAGE.md#常见问题)
- [构建失败](./USAGE.md#常见问题)

#### 调试技巧

```bash
# 查看路由树
npm run generate

# 启用详细日志
DEBUG=leeforge:* leeforge dev

# 检查类型
npm run typecheck

# 运行测试
npm test
````

### 📊 项目状态

#### 已完成 (20/29)

- ✅ **Phase 1**: 路由系统 (3/3) - 架构师
- ✅ **Phase 5**: 中间件系统 (2/2) - 架构师
- ✅ **Phase 10**: 文档示例 (2/2) - 架构师
- ✅ **Phase 4**: 数据层 (3/3) - 前端工程师
- ✅ **Phase 6**: CLI 工具 (4/4) - 前端工程师
- ✅ **Phase 9**: 类型系统 (2/2) - 前端工程师
- ✅ **Phase 2**: SSR 引擎 (3/3) - Node 工程师
- ✅ **Phase 3**: API 路由 (3/3) - Node 工程师
- ✅ **Phase 7**: Vite 插件 (2/2) - Node 工程师
- ✅ **Phase 8**: 生产服务器 (2/2) - Node 工程师

#### 待完成 (9/29)

- ⬜ **Phase 11**: 测试 (3/3) - 全员参与

### 🔗 相关链接

#### 开发者文档

- **[开发文档](./DEVELOPMENT.md)** - 贡献指南
- **[架构设计](../../design-doc.md)** - 技术决策
- **[任务追踪](../../tasks/TASK_TRACKER.md)** - 进度追踪

#### 团队总结

- **[架构师总结](../../tasks/ARCHITECT_SUMMARY.md)** - 7/7 任务完成
- **[前端工程师](./TASKS_FRONTEND_COMPLETE.md)** - 9/9 任务完成
- **[Node 工程师](./node开发工程师完成的任务.md)** - 10/10 任务完成

#### 示例项目

- **[博客示例](../examples/blog/README.md)** - 完整示例
- **[代码示例](../examples/blog/src/app/EXAMPLE_STRUCTURE.md)** - 参考代码

### 📞 获取帮助

#### 文档搜索

使用 `Ctrl+F` 或 `Cmd+F` 搜索关键词，例如：

- "路由" - 查找路由相关文档
- "守卫" - 查找认证相关文档
- "CLI" - 查找命令行工具文档

#### 问题反馈

1. **GitHub Issues**: 报告 bug 或请求功能
2. **Discord**: 社区讨论和帮助
3. **Stack Overflow**: 技术问答

### 🎯 下一步

#### 新手

1. 阅读 [快速开始](./GUIDE.md#快速开始)
2. 创建第一个应用
3. 学习路由系统
4. 添加中间件

#### 进阶

1. 深入理解 [SSR 原理](./README.md#SSR上下文)
2. 学习 [性能优化](./USAGE.md#性能优化)
3. 掌握 [CLI 工具](./USAGE.md#CLI工具)
4. 阅读 [开发文档](./DEVELOPMENT.md)

#### 专家

1. 阅读 [架构设计](../../design-doc.md)
2. 研究 [源码实现](./DEVELOPMENT.md#模块架构)
3. 贡献代码
4. 创建插件

---

## 📝 文档维护

### 文档列表

- `README.md` - API 参考文档
- `GUIDE.md` - 使用指南
- `USAGE.md` - 详细使用文档
- `DEVELOPMENT.md` - 开发文档
- `INDEX.md` - 本文档（导航索引）

### 更新频率

- **API 文档**: 每次 API 变更时更新
- **使用指南**: 新功能发布时更新
- **故障排除**: 收到用户反馈时更新
- **示例代码**: 最佳实践变更时更新

### 贡献文档

发现文档错误或缺失？

1. 在 GitHub 提交 issue
2. 或直接提交 PR 修改
3. 标签: `documentation`

---

**版本**: 0.1.0  
**最后更新**: 2026-01-15  
**维护者**: Leeforge Team
