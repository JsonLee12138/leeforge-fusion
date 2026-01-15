# 开发任务拆分与分配

## 项目结构

```
leeforge/
├── packages/
│   ├── framework/           # 核心框架
│   └── cli/                 # CLI 工具
├── examples/
│   └── blog/                # 示例应用
└── docs/                    # 文档
```

---

## 📋 Phase 1: 核心路由系统 (预计 5 天)

### 资深架构师 - 路由系统设计与实现

#### 任务 1.1: 路由扫描器

- **文件**: `packages/framework/src/router/scanner.ts`
- **负责人**: 资深架构师
- **描述**: 扫描 app/ 目录，生成路由树结构
- **输出**:
  - 支持文件系统路由
  - 解析动态路由 `[id]`
  - 支持路由组 `(dashboard)`
  - 生成 TanStack Router 兼容的路由配置

```typescript
// 任务 1.1 - 路由扫描器
export interface Route {
  path: string;
  file: string;
  type: "page" | "layout" | "api" | "server";
  params: string[];
  children?: Route[];
}

export class RouteScanner {
  scan(appDir: string): Promise<RouteTree>;
}
```

#### 任务 1.2: 路由生成器

- **文件**: `packages/framework/src/router/generator.ts`
- **负责人**: 资深架构师
- **描述**: 生成客户端路由代码
- **输出**:
  - 生成 TanStack Router `createFileRoute` 代码
  - 自动注入 loader 类型
  - 支持热重载

```typescript
// 任务 1.2 - 路由生成器
export class RouteGenerator {
  generate(routes: RouteTree): Promise<string>;
  generateClientEntry(routes: RouteTree): Promise<string>;
}
```

#### 任务 1.3: 路由配置管理

- **文件**: `packages/framework/src/config/route-config.ts`
- **负责人**: 资深架构师
- **描述**: 路由相关配置管理
- **输出**:
  - 路由前缀配置
  - 路由组映射
  - 路由守卫配置

```typescript
// 任务 1.3 - 路由配置
export interface RouteConfig {
  base: string;
  groups: Record<string, string>;
  trailingSlash: "never" | "always";
}

export function defineRoutes(config: RouteConfig): RouteConfig;
```

---

## 📋 Phase 2: SSR 渲染引擎 (预计 4 天)

### 资深 Node 工程师 - SSR 核心实现

#### 任务 2.1: SSR 渲染器

- **文件**: `packages/framework/src/ssr/renderer.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 服务端渲染核心逻辑
- **输出**:
  - TanStack Router SSR 集成
  - 数据预取与注入
  - HTML 生成与水合

```typescript
// 任务 2.1 - SSR 渲染器
export class SSRRenderer {
  constructor(options: { routes: RouteTree });

  render(
    url: string,
    context: AppContext,
  ): Promise<{
    html: string;
    dehydratedState: any;
    routerState: any;
  }>;
}
```

#### 任务 2.2: 水合客户端入口

- **文件**: `packages/framework/src/client/hydration.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 客户端水合逻辑
- **输出**:
  - 从服务端状态恢复
  - TanStack Router 客户端初始化
  - QueryClient 状态恢复

```typescript
// 任务 2.2 - 水合入口
export function hydrateApp(options: {
  dehydratedState: any;
  routerState: any;
  user?: any;
}): void;
```

#### 任务 2.3: 上下文管理

- **文件**: `packages/framework/src/ssr/context.ts`
- **负责人**: 资深 Node 工程师
- **描述**: SSR 运行时上下文
- **输出**:
  - 请求上下文
  - 用户认证信息
  - API 基础 URL

```typescript
// 任务 2.3 - 上下文管理
export interface AppContext {
  user?: User;
  API_BASE: string;
  queryClient: QueryClient;
  request: Request;
}
```

---

## 📋 Phase 3: API 路由系统 (预计 3 天)

### 资深 Node 工程师 - Hono 集成

#### 任务 3.1: API 路由扫描器

- **文件**: `packages/framework/src/api/scanner.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 扫描 app/api 目录
- **输出**:
  - 解析 Hono 路由模块
  - 支持动态路由参数
  - 生成路由注册代码

```typescript
// 任务 3.1 - API 扫描器
export class APIScanner {
  scan(apiDir: string): Promise<APIRoute[]>;
}

export interface APIRoute {
  path: string;
  file: string;
  methods: ("get" | "post" | "put" | "delete" | "patch")[];
}
```

#### 任务 3.2: API 路由注册器

- **文件**: `packages/framework/src/api/registry.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 自动注册 API 路由
- **输出**:
  - Hono 应用创建
  - 路由自动挂载
  - 中间件支持

```typescript
// 任务 3.2 - API 注册器
export class APIRegistry {
  constructor(app: Hono);

  register(routes: APIRoute[]): Promise<void>;
}
```

#### 任务 3.3: Server Actions 支持

- **文件**: `packages/framework/src/server-actions.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 服务端动作支持
- **输出**:
  - `'use server'` 标记解析
  - RPC 调用生成
  - 类型安全

```typescript
// 任务 3.3 - Server Actions
export function createAction<T extends (...args: any[]) => any>(fn: T): T;

export function createServerFn<T extends (...args: any[]) => any>(fn: T): T;
```

---

## 📋 Phase 4: 数据层集成 (预计 3 天)

### 资深前端开发工程师 - TanStack Query 集成

#### 任务 4.1: Query Client 配置

- **文件**: `packages/framework/src/query/client.ts`
- **负责人**: 资深前端开发工程师
- **描述**: TanStack Query 客户端配置
- **输出**:
  - QueryClient 实例创建
  - SSR 状态水合配置
  - 缓存策略配置

```typescript
// 任务 4.1 - Query Client
export function createQueryClient(options?: {
  ssr?: boolean;
  staleTime?: number;
  gcTime?: number;
}): QueryClient;

export function hydrateQueryClient(client: QueryClient, state: any): void;
```

#### 任务 4.2: Loader 类型定义

- **文件**: `packages/framework/src/router/loader-types.ts`
- **负责人**: 资深前端开发工程师
- **描述**: Loader 函数的类型支持
- **输出**:
  - Loader 上下文类型
  - 返回值类型推断
  - 错误处理类型

```typescript
// 任务 4.2 - Loader 类型
export interface LoaderContext {
  queryClient: QueryClient;
  user?: User;
  API_BASE: string;
}

export type Loader<T = any> = (context: LoaderContext) => Promise<T> | T;
```

#### 任务 4.3: 数据获取工具

- **文件**: `packages/framework/src/data/fetch.ts`
- **负责人**: 资深前端开发工程师
- **描述**: 数据获取辅助函数
- **输出**:
  - fetch 封装
  - 错误处理
  - 类型安全

```typescript
// 任务 4.3 - 数据获取
export function apiFetch<T>(url: string, options?: RequestInit): Promise<T>;

export function withAuth(token: string): RequestInit;
```

---

## 📋 Phase 5: 中间件系统 (预计 2 天)

### 资深架构师 - 中间件设计

#### 任务 5.1: Hono 中间件工具

- **文件**: `packages/framework/src/middleware/hono.ts`
- **负责人**: 资深架构师
- **描述**: Hono 中间件辅助函数
- **输出**:
  - 认证中间件
  - 日志中间件
  - 错误处理中间件

```typescript
// 任务 5.1 - Hono 中间件
export const authMiddleware: MiddlewareHandler;
export const loggerMiddleware: MiddlewareHandler;
export const errorHandler: ErrorHandler;
```

#### 任务 5.2: 路由守卫

- **文件**: `packages/framework/src/middleware/route-guard.ts`
- **负责人**: 资深架构师
- **描述**: TanStack Router 路由守卫
- **输出**:
  - beforeLoad 支持
  - 重定向工具
  - 权限检查

```typescript
// 任务 5.2 - 路由守卫
export function defineGuard(
  guard: (context: LoaderContext) => Promise<void> | void,
): LoaderContext;

export function redirect(to: string): never;
```

---

## 📋 Phase 6: CLI 工具 (预计 4 天)

### 资深前端开发工程师 - 命令行工具

#### 任务 6.1: CLI 主程序

- **文件**: `packages/cli/src/index.ts`
- **负责人**: 资深前端开发工程师
- **描述**: CLI 入口和命令注册
- **输出**:
  - 命令解析
  - 子命令注册
  - 版本管理

```typescript
// 任务 6.1 - CLI 主程序
import { Command } from "commander";

export const program = new Command()
  .name("leeforge")
  .version("1.0.0")
  .command("dev")
  .command("build");
// ... 其他命令
```

#### 任务 6.2: 开发服务器命令

- **文件**: `packages/cli/src/commands/dev.ts`
- **负责人**: 资深前端开发工程师
- **描述**: `leeforge dev` 命令实现
- **输出**:
  - Vite + Hono 启动
  - 热重载配置
  - 端口管理

```typescript
// 任务 6.2 - Dev 命令
export function devCommand(port: number): Promise<void>;
```

#### 任务 6.3: 构建命令

- **文件**: `packages/cli/src/commands/build.ts`
- **负责人**: 资深前端开发工程师
- **描述**: `leeforge build` 命令实现
- **输出**:
  - 客户端构建
  - 服务端构建
  - 静态生成

```typescript
// 任务 6.3 - Build 命令
export function buildCommand(): Promise<void>;
```

#### 任务 6.4: 生成器命令

- **文件**: `packages/cli/src/commands/generate.ts`
- **负责人**: 资深前端开发工程师
- **描述**: 代码生成命令
- **输出**:
  - 页面生成器
  - API 生成器
  - 组件生成器

```typescript
// 任务 6.4 - Generate 命令
export function generateCommand(
  type: "page" | "api" | "component",
  name: string,
  options: any,
): Promise<void>;
```

---

## 📋 Phase 7: Vite 插件 (预计 2 天)

### 资深 Node 工程师 - 构建工具集成

#### 任务 7.1: 框架 Vite 插件

- **文件**: `packages/framework/src/vite-plugin.ts`
- **负责人**: 资深 Node 工程师
- **描述**: Vite 插件核心
- **输出**:
  - 路由生成钩子
  - 热重载处理
  - SSR 构建配置

```typescript
// 任务 7.1 - Vite 插件
export function frameworkPlugin(options: {
  appDir: string;
  apiDir: string;
}): Plugin;
```

#### 任务 7.2: 开发服务器集成

- **文件**: `packages/framework/src/dev-server.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 开发服务器启动
- **输出**:
  - Vite 中间件集成
  - Hono 服务器启动
  - SSR 渲染管道

```typescript
// 任务 7.2 - 开发服务器
export async function startDevServer(options: { port: number }): Promise<void>;
```

---

## 📋 Phase 8: 生产服务器 (预计 2 天)

### 资深 Node 工程师 - 生产环境

#### 8.1: 生产服务器

- **文件**: `packages/framework/src/prod-server.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 生产环境服务器
- **输出**:
  - 静态文件服务
  - API 路由加载
  - SSR 渲染

```typescript
// 任务 8.1 - 生产服务器
export async function startProdServer(options: { port: number }): Promise<void>;
```

#### 8.2: 部署脚本

- **文件**: `packages/framework/scripts/deploy.ts`
- **负责人**: 资深 Node 工程师
- **描述**: 部署辅助脚本
- **输出**:
  - Docker 配置生成
  - 环境变量管理
  - 部署检查清单

```typescript
// 任务 8.2 - 部署脚本
export function generateDockerfile(): string;
export function checkProductionBuild(): Promise<boolean>;
```

---

## 📋 Phase 9: 类型系统 (预计 2 天)

### 资深前端开发工程师 - TypeScript 集成

#### 任务 9.1: 公共类型定义

- **文件**: `packages/framework/src/types/index.ts`
- **负责人**: 资深前端开发工程师
- **描述**: 框架公共类型
- **输出**:
  - 路由类型
  - 上下文类型
  - 配置类型

```typescript
// 任务 9.1 - 公共类型
export interface RouteContext {}
export interface FrameworkConfig {}
export interface SSRResult {}
```

#### 任务 9.2: TS 配置生成器

- **文件**: `packages/framework/src/config/tsconfig.ts`
- **负责人**: 资深前端开发工程师
- **描述**: TypeScript 配置管理
- **输出**:
  - tsconfig.json 生成
  - 路径别名配置
  - 类型声明生成

```typescript
// 任务 9.2 - TS 配置
export function generateTSConfig(): {
  compilerOptions: any;
  include: string[];
};
```

---

## 📋 Phase 10: 文档与示例 (预计 3 天)

### 资深架构师 - 文档与示例

#### 任务 10.1: API 文档

- **文件**: `docs/api.md`
- **负责人**: 资深架构师
- **描述**: 框架 API 文档
- **输出**:
  - 路由 API
  - 数据获取 API
  - 配置 API

#### 任务 10.2: 示例应用

- **文件**: `examples/blog/`
- **负责人**: 资深架构师
- **描述**: 完整示例应用
- **输出**:
  - 博客系统
  - 用户认证
  - API 示例

```typescript
// 示例应用结构
examples/blog/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── api/
│   │       └── posts/
│   │           └── route.ts
│   └── lib/
│       └── db.ts
├── package.json
└── framework.config.ts
```

---

## 📋 Phase 11: 测试 (预计 3 天)

### 全员参与

#### 任务 11.1: 单元测试

- **文件**: `packages/framework/tests/unit/`
- **负责人**: 资深前端开发工程师
- **描述**: 核心模块单元测试
- **输出**:
  - 路由扫描器测试
  - 渲染器测试
  - 类型测试

#### 任务 11.2: 集成测试

- **文件**: `packages/framework/tests/integration/`
- **负责人**: 资深 Node 工程师
- **描述**: 完整流程测试
- **输出**:
  - SSR 渲染测试
  - API 路由测试
  - 水合测试

#### 任务 11.3: E2E 测试

- **文件**: `tests/e2e/`
- **负责人**: 资深架构师
- **描述**: 端到端测试
- **输出**:
  - 完整用户流程
  - 性能测试
  - 部署测试

---

## 📊 任务总览表

| Phase         | 任务数 | 负责人      | 预计天数 | 优先级 |
| ------------- | ------ | ----------- | -------- | ------ |
| 1. 路由系统   | 3      | 架构师      | 5        | 🔴 P0  |
| 2. SSR 引擎   | 3      | Node 工程师 | 4        | 🔴 P0  |
| 3. API 路由   | 3      | Node 工程师 | 3        | 🔴 P0  |
| 4. 数据层     | 3      | 前端工程师  | 3        | 🟡 P1  |
| 5. 中间件     | 2      | 架构师      | 2        | 🟡 P1  |
| 6. CLI 工具   | 4      | 前端工程师  | 4        | 🟡 P1  |
| 7. Vite 插件  | 2      | Node 工程师 | 2        | 🟢 P2  |
| 8. 生产服务器 | 2      | Node 工程师 | 2        | 🟢 P2  |
| 9. 类型系统   | 2      | 前端工程师  | 2        | 🟢 P2  |
| 10. 文档示例  | 2      | 架构师      | 3        | 🟢 P2  |
| 11. 测试      | 3      | 全员        | 3        | 🟢 P2  |

**总计**: 29 个任务，预计 29 天，3 人并行开发

---

## 🎯 依赖关系

```
Phase 1 (路由) → Phase 2 (SSR) → Phase 7 (Vite 插件)
    ↓
Phase 3 (API) → Phase 8 (生产服务器)
    ↓
Phase 4 (数据) → Phase 5 (中间件)
    ↓
Phase 6 (CLI) → Phase 10 (示例)
    ↓
Phase 9 (类型) → Phase 11 (测试)
```

---

## 📝 每日站会建议

### 周一/三/五

- 架构师: 路由系统进度，设计评审
- Node 工程师: SSR 和 API 进度，技术难点
- 前端工程师: 数据层和 CLI 进度，类型问题

### 周二/四

- 代码审查
- 集成测试
- 问题同步

---

## 🚀 关键里程碑

- **Day 5**: 路由系统完成，可以生成基本路由
- **Day 9**: SSR 渲染器完成，可以渲染页面
- **Day 12**: API 路由完成，可以调用接口
- **Day 15**: 数据层完成，可以数据获取
- **Day 19**: CLI 工具完成，可以命令行操作
- **Day 22**: Vite 插件完成，开发体验完善
- **Day 24**: 生产服务器完成，可以部署
- **Day 29**: 测试完成，发布 Beta 版

---

## 💡 质量要求

### 代码规范

- ✅ 完整的 TypeScript 类型
- ✅ JSDoc 注释
- ✅ 单元测试覆盖率 > 80%
- ✅ ESLint + Prettier

### 文档要求

- ✅ 每个模块有 README
- ✅ API 文档完整
- ✅ 示例代码可运行

### 交付标准

- ✅ 任务完成 = 代码 + 测试 + 文档
- ✅ 代码审查通过
- ✅ 集成测试通过
- ✅ 示例应用运行正常

---

## 📞 沟通机制

### 技术决策

- **架构师**: 最终技术决策者
- **每日站会**: 15 分钟同步进度
- **周会**: 周五下午，回顾与规划

### 代码审查

- **PR 模板**: 包含任务编号、测试结果、文档更新
- **审查周期**: 24 小时内完成
- **合并标准**: 至少 1 人 Approve + CI 通过

### 问题升级

- 技术问题 → 架构师
- 实现问题 → 相关模块负责人
- 阻塞问题 → 立即同步

---

## 🎉 成功标准

当以下全部完成时，项目 Phase 1 成功：

1. ✅ 可以通过 CLI 创建新项目
2. ✅ 文件系统路由正常工作
3. ✅ SSR 渲染正确
4. ✅ API 路由可访问
5. ✅ 数据获取和缓存正常
6. ✅ 热重载工作
7. ✅ 示例应用运行
8. ✅ 测试通过率 > 80%

---

**文档版本**: v1.0  
**创建日期**: 2026-01-15  
**最后更新**: 2026-01-15  
**项目经理**: 架构师
