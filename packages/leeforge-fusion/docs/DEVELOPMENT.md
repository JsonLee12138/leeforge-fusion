# Leeforge Fusion - 开发文档

**版本**: 0.1.0  
**最后更新**: 2026-01-15  
**目标读者**: 框架开发者和贡献者

---

## 📋 项目概览

Leeforge Fusion 是一个基于 SolidJS 和 TanStack Router 的全栈框架，提供完整的路由系统、中间件、SSR 渲染和 CLI 工具。

### 架构分层

```
┌─────────────────────────────────────────┐
│           用户应用层 (User App)          │
├─────────────────────────────────────────┤
│        框架 API 层 (@/index.ts)         │
├─────────────────────────────────────────┤
│  核心模块层                              │
│  - 路由系统 (router/)                   │
│  - 配置系统 (config/)                   │
│  - 中间件 (middleware/)                 │
│  - SSR 引擎 (ssr/)                      │
│  - API 系统 (api/)                      │
│  - 数据层 (data/, query/)               │
│  - CLI 工具 (cli/)                      │
│  - Vite 插件 (vite-plugin.ts)          │
├─────────────────────────────────────────┤
│        基础设施层                        │
│  - TypeScript                           │
│  - Vite                                 │
│  - Hono/Express                         │
└─────────────────────────────────────────┘
```

---

## 🏗️ 模块架构

### 1. 路由系统 (`src/router/`)

**负责人**: 资深架构师

**文件结构**:

```
src/router/
├── types.ts           # 路由类型定义
├── scanner.ts         # 路由扫描器 (8 tests)
├── generator.ts       # 路由生成器
├── utils.ts           # 路由工具函数
├── loader-types.ts    # Loader 类型 (前端)
├── loader-context.ts  # Loader 上下文 (前端)
└── index.ts           # 导出
```

**核心类**:

- `RouteScanner` - 扫描 app/ 目录生成路由树
- `RouteGenerator` - 生成 TanStack Router 代码

**依赖**: `glob`, `minimatch`

**接口**:

```typescript
interface Route {
  path: string;
  file: string;
  type: "page" | "layout" | "api" | "server";
  params: string[];
  children?: Route[];
}

interface ScannerConfig {
  appDir: string;
  ignore?: string[];
  cache?: boolean;
}
```

---

### 2. 配置系统 (`src/config/`)

**负责人**: 资深架构师

**文件结构**:

```
src/config/
├── route-config.ts    # 配置管理 (10 tests)
├── tsconfig.ts        # TS 配置生成 (前端)
└── index.ts           # 导出
```

**核心类**:

- `RouteConfigManager` - 管理路由配置

**接口**:

```typescript
interface RouteConfig {
  base?: string;
  trailingSlash?: "never" | "always";
  groups?: Record<string, string>;
  guards?: Record<string, string>;
  ignore?: string[];
}
```

---

### 3. 中间件系统 (`src/middleware/`)

**负责人**: 资深架构师

**文件结构**:

```
src/middleware/
├── hono.ts            # Hono 中间件 (7 tests)
├── route-guard.ts     # 路由守卫 (9 tests)
├── redirect.ts        # 重定向工具
└── index.ts           # 导出
```

**核心功能**:

- `authMiddleware` - 认证检查
- `loggerMiddleware` - 请求日志
- `errorMiddleware` - 错误处理
- `corsMiddleware` - CORS 支持
- `defineGuard` - 守卫工厂
- `redirect` - 重定向异常

**依赖**: `hono`

---

### 4. SSR 引擎 (`src/ssr/`)

**负责人**: 资深 Node 工程师

**文件结构**:

```
src/ssr/
├── renderer.ts        # SSR 渲染器
├── template.ts        # HTML 模板
├── context.ts         # 上下文管理
└── index.ts           # 导出
```

**核心类**:

- `SSRRenderer` - 服务端渲染核心
- `ContextManager` - SSR 上下文管理

**流程**:

```
请求 → Context → SSRRenderer → Loader → 渲染 → HTML → 水合注入
```

**依赖**: `@tanstack/solid-router`, `@tanstack/solid-query`

---

### 5. API 系统 (`src/api/`)

**负责人**: 资深 Node 工程师

**文件结构**:

```
src/api/
├── scanner.ts         # API 路由扫描器
├── registry.ts        # API 路由注册器
├── middleware.ts      # API 中间件
├── types.ts           # API 类型
└── index.ts           # 导出
```

**核心类**:

- `APIScanner` - 扫描 app/api/ 目录
- `APIRegistry` - 注册路由到 Hono

**流程**:

```
扫描 → 提取方法 → 注册 → Hono 路由
```

---

### 6. 数据层 (`src/data/`, `src/query/`)

**负责人**: 资深前端工程师

**文件结构**:

```
src/data/
├── fetch.ts           # Fetch 封装
├── auth.ts            # 认证工具
└── index.ts           # 导出

src/query/
├── client.ts          # Query Client 配置
└── index.ts           # 导出
```

**核心功能**:

- `apiFetch` - 类型安全的 fetch
- `withAuth` - 认证头封装
- `createQueryClient` - Query Client 配置

---

### 7. CLI 工具 (`packages/cli/`)

**负责人**: 资深前端工程师

**文件结构**:

```
packages/cli/
├── package.json
├── src/
│   ├── index.ts        # CLI 入口
│   ├── commands/
│   │   ├── dev.ts      # Dev 命令
│   │   ├── build.ts    # Build 命令
│   │   └── generate.ts # Generate 命令
│   └── generators/
│       ├── page.ts     # 页面生成器
│       ├── api.ts      # API 生成器
│       └── component.ts # 组件生成器
```

**命令**:

```bash
leeforge dev [options]
leeforge build
leeforge generate <type> <name>
```

---

### 8. Vite 插件 (`src/vite-plugin.ts`)

**负责人**: 资深 Node 工程师

**核心功能**:

- 路由自动生成
- 热重载支持
- 模块解析
- SSR 构建配置

**生命周期**:

```
configResolved → buildStart → handleHotUpdate → resolveId
```

---

### 9. 生产服务器 (`src/prod-server.ts`)

**负责人**: 资深 Node 工程师

**核心功能**:

- 静态文件服务
- API 路由加载
- SSR 渲染
- 健康检查

---

## 🔧 开发工作流

### 1. 环境设置

```bash
# 克隆仓库
git clone https://github.com/your-org/leeforge-fusion
cd leeforge-fusion

# 安装依赖
npm install

# 构建框架
npm run build

# 运行测试
npm test
```

### 2. 代码结构规范

#### 文件组织

```
src/
├── module/
│   ├── core.ts        # 核心逻辑
│   ├── types.ts       # 类型定义
│   ├── utils.ts       # 工具函数
│   └── index.ts       # 导出
```

#### 命名约定

- **类**: `PascalCase` (如 `RouteScanner`)
- **函数**: `camelCase` (如 `scanRoutes`)
- **变量**: `camelCase` (如 `appDir`)
- **常量**: `UPPER_SNAKE_CASE` (如 `DEFAULT_CACHE_TIME`)
- **接口**: `PascalCase` + `Interface` 后缀 (如 `ScannerConfig`)

#### 导出规范

```typescript
// index.ts - 只导出公共 API
export { RouteScanner } from "./scanner";
export type { Route, ScannerConfig } from "./types";

// 内部工具不导出
// function internalHelper() { ... }
```

### 3. 类型安全规则

#### 禁止

- ❌ `as any`
- ❌ `@ts-ignore`
- ❌ 隐式类型推断（复杂场景）

#### 必须

- ✅ 明确的返回类型
- ✅ 接口定义
- ✅ 泛型约束

```typescript
// ✅ 好
function scan<T extends Route>(routes: T[]): Promise<T[]>;

// ❌ 坏
function scan(routes: any) {
  return routes.map((r) => r.path); // 隐式 any
}
```

### 4. 测试规范

#### 测试文件位置

```
tests/
├── unit/
│   ├── router/
│   │   └── scanner.test.ts
│   ├── config/
│   │   └── route-config.test.ts
│   └── middleware/
│       ├── hono.test.ts
│       └── route-guard.test.ts
```

#### 测试风格

```typescript
import { describe, test, expect } from "vitest";
import { RouteScanner } from "@/router/scanner";

describe("RouteScanner", () => {
  test("scans basic routes", async () => {
    const scanner = new RouteScanner({ appDir: "./test-app" });
    const result = await scanner.scan();

    expect(result.routes.length).toBeGreaterThan(0);
    expect(result.conflicts).toEqual([]);
  });
});
```

#### 测试覆盖率要求

- 核心逻辑: 100%
- 边界情况: 必须覆盖
- 错误处理: 必须测试

### 5. 文档规范

#### JSDoc（仅公共 API）

````typescript
/**
 * 扫描 app/ 目录并生成路由树
 *
 * @param config - 扫描器配置
 * @returns 包含路由树和冲突检测的结果
 *
 * @example
 * ```typescript
 * const scanner = new RouteScanner({ appDir: "./app" });
 * const result = await scanner.scan();
 * ```
 */
export async function scan(config: ScannerConfig): Promise<ScanResult> {
  // ...
}
````

#### 内联注释

仅在复杂算法或非直观逻辑处使用，且必须简洁。

```typescript
// ✅ 好 - 解释为什么
// 使用深度优先算法，确保父路由先于子路由处理
const sortedRoutes = sortRoutes(routes);

// ❌ 坏 - 解释做什么
// 遍历所有路由
for (const route of routes) {
  // 处理每个路由
  process(route);
}
```

### 6. 依赖管理

#### 内部依赖

```typescript
// ✅ 使用相对路径
import { RouteScanner } from "../router/scanner";

// ❌ 避免循环依赖
// router/index.ts → middleware/index.ts → router/index.ts
```

#### 外部依赖

```typescript
// package.json
{
  "dependencies": {
    "glob": "^11.0.0",      // 文件扫描
    "hono": "^4.6.0",       // 中间件
    "solid-js": "^1.9.10"   // UI 框架
  },
  "devDependencies": {
    "vitest": "^2.0.0",     // 测试
    "typescript": "^5.6.0"  // 类型检查
  }
}
```

### 7. Git 工作流

#### 分支命名

- `feature/router-scanner` - 新功能
- `bugfix/scan-conflict` - Bug 修复
- `docs/api-update` - 文档更新

#### 提交信息

```
类型(范围): 简短描述

详细描述（可选）

BREAKING CHANGE: 重大变更说明
```

**类型**:

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档
- `test`: 测试
- `refactor`: 重构
- `perf`: 性能优化

**示例**:

```
feat(router): 添加路由冲突检测

实现基于路径映射的冲突检测算法，
支持重复路径和动态路由冲突识别。

BREAKING CHANGE: ScannerConfig 接口新增 conflictDetection 选项
```

---

## 🧪 测试策略

### 单元测试

```bash
# 运行所有测试
npm test

# 运行特定模块
npm test -- router

# 覆盖率报告
npm test -- --coverage
```

### 集成测试

```bash
# 测试完整流程
npm run test:integration

# 测试 CLI
npm run test:cli
```

### E2E 测试

```bash
# 浏览器测试
npm run test:e2e

# 生产构建测试
npm run test:prod
```

---

## 📦 构建和发布

### 构建流程

```bash
# 1. 类型检查
npm run typecheck

# 2. 运行测试
npm test

# 3. 构建代码
npm run build

# 4. 打包
npm pack
```

### 发布流程

```bash
# 1. 更新版本
npm version patch|minor|major

# 2. 构建
npm run build

# 3. 发布到 npm
npm publish

# 4. 创建 Git 标签
git push --tags
```

---

## 🎯 质量保证

### 代码审查清单

- [ ] 类型安全（无 `as any`）
- [ ] 测试覆盖率 > 80%
- [ ] 文档更新
- [ ] 无多余注释
- [ ] 遵循命名约定
- [ ] 错误处理完善
- [ ] 性能考虑
- [ ] 向后兼容

### 性能标准

- 路由扫描: < 100ms (100 个路由)
- SSR 渲染: < 50ms (无数据获取)
- CLI 启动: < 500ms
- 内存使用: < 50MB

### 安全要求

- ✅ 输入验证
- ✅ SQL 注入防护（如果使用数据库）
- ✅ XSS 防护
- ✅ CSRF 令牌
- ✅ 认证检查

---

## 🚨 故障排除

### 常见问题

#### 1. 类型错误

```bash
# 检查类型
npm run typecheck

# 修复自动修复
npm run lint:fix
```

#### 2. 测试失败

```bash
# 查看详细输出
npm test -- --reporter=verbose

# 调试特定测试
npm test -- --inspect
```

#### 3. 构建失败

```bash
# 清理缓存
rm -rf node_modules/.vite

# 重新安装
npm ci
```

---

## 📞 沟通和协作

### 每日站会

- **时间**: 每天 10:00
- **时长**: 15 分钟
- **内容**:
  - 昨天完成的工作
  - 今天计划
  - 阻塞问题

### 代码审查

- **PR 模板**: 必须包含变更说明和测试结果
- **审查时间**: 24 小时内
- **批准要求**: 至少 1 名架构师 + 1 名同级

### 技术决策

- **架构决策**: 架构师最终决定
- **API 设计**: 需要架构师批准
- **重大变更**: 需要团队讨论

---

## 🔗 相关资源

- [API 文档](./README.md)
- [使用指南](./GUIDE.md)
- [任务追踪](../../tasks/TASK_TRACKER.md)
- [架构师总结](../../tasks/ARCHITECT_SUMMARY.md)
- [前端工程师总结](./TASKS_FRONTEND_COMPLETE.md)
- [Node 工程师总结](./node开发工程师完成的任务.md)

---

**文档维护**: 架构师  
**最后更新**: 2026-01-15
