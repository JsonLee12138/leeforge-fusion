# ESLint 配置方案：Workspace/Monorepo 项目

> 将 ESLint 配置封装为独立的 NPM 包，在 Workspace 中共享使用

## 📋 项目结构

### 1. 创建 ESLint Config 包

```
workspace/
├── packages/
│   └── eslint-config/
│       ├── src/
│       │   └── index.ts          # 主配置文件
│       ├── eslint.config.js      # 导出配置
│       ├── package.json          # 包配置
│       ├── tsdown.config.ts      # 构建配置
│       └── README.md             # 文档
├── apps/
│   ├── app1/
│   └── app2/
└── pnpm-workspace.yaml
```

## 🚀 快速开始

### 步骤 1: 创建配置包

```bash
# 进入 packages 目录
cd packages

# 创建 eslint-config 包目录
mkdir eslint-config
cd eslint-config

# 初始化 package.json
pnpm init
```

### 步骤 2: 配置 package.json

```json
{
  "name": "@your-scope/eslint-config",
  "version": "1.0.0",
  "description": "Shared ESLint configuration for workspace projects",
  "type": "module",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/es/index.mjs",
  "exports": {
    ".": "./dist/cjs/index.cjs",
    "./es": "./dist/es/index.mjs",
    "./cjs": "./dist/cjs/index.cjs",
    "./package.json": "./package.json"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "keywords": [
    "eslint",
    "config",
    "workspace",
    "monorepo",
    "typescript"
  ],
  "dependencies": {
    "@antfu/eslint-config": "^6.0.0",
    "eslint-plugin-format": "^1.0.2"
  },
  "devDependencies": {
    "eslint": "^9.37.0",
    "tsdown": "^0.15.9"
  },
  "peerDependencies": {
    "eslint": "^9.0.0"
  }
}
```

### 步骤 3: 安装依赖

```bash
# 安装所有依赖
pnpm install

# 或者单独安装
pnpm add @antfu/eslint-config eslint-plugin-format
pnpm add -D eslint tsdown
```

### 步骤 4: 创建主配置文件

**src/index.ts**:
```typescript
import antfu from '@antfu/eslint-config'

type Options = Parameters<typeof antfu>[0]

/**
 * Shared ESLint configuration for workspace projects
 *
 * @param options - Antfu ESLint configuration options
 * @returns Configured ESLint config
 *
 * @example
 * ```javascript
 * // eslint.config.js
 * import config from '@your-scope/eslint-config'
 *
 * export default config({
 *   typescript: true,
 *   react: true,
 *   rules: {
 *     // Custom rules
 *   }
 * })
 * ```
 */
export default (options: Options = {}) => {
  // 默认样式配置
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    endOfLine: 'lf',
    trailingComma: 'all',
    semi: false,  // 无分号 - 符合你的标准
  } as any

  // 合并自定义样式配置
  if (typeof options.stylistic === 'object') {
    Object.assign(stylisticConfig, options.stylistic)
    delete options.stylistic
  }

  // 返回配置
  return antfu({
    formatters: true,
    stylistic: stylisticConfig,
    // 默认启用 TypeScript 和 React 支持
    typescript: true,
    react: true,
    ...options,
  })
}
```

### 步骤 5: 创建构建配置

**tsdown.config.ts**:
```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['es', 'cjs'],
  outDir: 'dist',
  clean: true,
  dts: true,
})
```

**eslint.config.js**:
```javascript
import config from './src/index.js'

export default config
```

### 步骤 6: 构建包

```bash
# 构建
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```

## 📦 在 Workspace 中使用

### 1. 添加到工作区根目录

在根目录的 `pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### 2. 在子项目中使用

**apps/app1/package.json**:
```json
{
  "name": "@your-scope/app1",
  "devDependencies": {
    "@your-scope/eslint-config": "workspace:*",
    "eslint": "^9.37.0"
  },
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

**apps/app1/eslint.config.js**:
```javascript
import config from '@your-scope/eslint-config'

export default config({
  // 项目特定配置
  typescript: true,
  react: true,

  // 自定义规则
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
  },

  // 忽略文件
  ignores: [
    'dist/',
    'node_modules/',
    'coverage/',
  ],
})
```

## 🔧 高级配置

### 1. 多环境配置

**src/index.ts**:
```typescript
import antfu from '@antfu/eslint-config'

type Options = Parameters<typeof antfu>[0]

interface CustomOptions extends Options {
  // 环境配置
  env?: 'browser' | 'node' | 'deno'

  // 框架配置
  framework?: 'react' | 'vue' | 'svelte' | 'none'

  // 严格级别
  strict?: 'loose' | 'standard' | 'strict'
}

export default (options: CustomOptions = {}) => {
  const {
    env = 'browser',
    framework = 'react',
    strict = 'standard',
    ...restOptions
  } = options

  // 基础样式配置
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    semi: false,
    trailingComma: 'all',
  }

  // 严格级别配置
  const strictRules = {
    loose: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'warn',
    },
    standard: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
    },
    strict: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error',
    },
  }

  // 框架检测
  const frameworkConfig = {
    react: { react: true },
    vue: { vue: true },
    svelte: { svelte: true },
    none: {},
  }

  return antfu({
    formatters: true,
    stylistic: stylisticConfig,
    typescript: true,
    ...frameworkConfig[framework],
    rules: {
      ...strictRules[strict],
      ...(restOptions.rules || {}),
    },
    ...restOptions,
  })
}
```

### 2. 预设配置导出

**src/presets.ts**:
```typescript
import config from './index.js'

// React 预设
export const react = (options = {}) => config({
  framework: 'react',
  ...options,
})

// Vue 预设
export const vue = (options = {}) => config({
  framework: 'vue',
  ...options,
})

// Node.js 预设
export const node = (options = {}) => config({
  env: 'node',
  framework: 'none',
  ...options,
})

// 严格模式预设
export const strict = (options = {}) => config({
  strict: 'strict',
  ...options,
})
```

**src/index.ts**:
```typescript
export { default, react, vue, node, strict } from './presets.js'
```

### 3. 使用预设

**apps/app1/eslint.config.js**:
```javascript
import { react } from '@your-scope/eslint-config'

export default react({
  rules: {
    'no-console': 'warn',
  },
})
```

## 🎯 工作区最佳实践

### 1. 版本管理

```bash
# 在根目录管理所有依赖
cd workspace-root

# 添加 eslint-config 到工作区
pnpm add -w -D eslint

# 在 eslint-config 包中添加依赖
cd packages/eslint-config
pnpm add @antfu/eslint-config
```

### 2. 脚本统一

**根目录 package.json**:
```json
{
  "scripts": {
    "lint": "pnpm -r --parallel lint",
    "lint:fix": "pnpm -r --parallel lint:fix",
    "lint:eslint-config": "cd packages/eslint-config && pnpm build"
  }
}
```

### 3. 开发工作流

```bash
# 1. 修改 eslint-config
cd packages/eslint-config
pnpm dev  # 监听模式

# 2. 在另一个终端测试
cd apps/app1
pnpm lint

# 3. 发布前构建
cd packages/eslint-config
pnpm build
```

## 📚 完整示例

### 示例 1: React 应用配置

**apps/web-app/eslint.config.js**:
```javascript
import config from '@your-scope/eslint-config'

export default config({
  typescript: true,
  react: true,

  rules: {
    // React 最佳实践
    'react-hooks/exhaustive-deps': 'error',
    'react/no-unstable-nested-components': 'warn',

    // 性能优化
    'react/no-array-index-key': 'warn',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // 业务特定
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },

  ignores: [
    'dist/',
    'build/',
    'node_modules/',
    'coverage/',
    '*.config.js',
    'vite.config.ts',
  ],
})
```

### 示例 2: Node.js 服务配置

**apps/api-service/eslint.config.js**:
```javascript
import config from '@your-scope/eslint-config'

export default config({
  typescript: true,
  react: false,  // 无 React

  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-var-requires': 'off', // 允许 require
    '@typescript-eslint/no-explicit-any': 'warn',
  },

  ignores: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.config.js',
  ],
})
```

### 示例 3: 组件库配置

**packages/ui-library/eslint.config.js**:
```javascript
import config from '@your-scope/eslint-config'

export default config({
  typescript: true,
  react: true,

  rules: {
    // 组件库特定规则
    'react/prop-types': 'off', // 使用 TypeScript
    'react/react-in-jsx-scope': 'off', // 自动导入

    // 禁止某些 API
    'no-restricted-imports': ['error', {
      paths: [{
        name: 'lodash',
        message: '使用 lodash-es 或原生方法'
      }],
    }],
  },
})
```

## 🔍 故障排除

### 问题 1: 找不到配置包

**解决方案**:
```bash
# 确保已构建
cd packages/eslint-config
pnpm build

# 确保工作区正确配置
cd workspace-root
pnpm install

# 检查链接
pnpm list @your-scope/eslint-config
```

### 问题 2: 版本冲突

**解决方案**:
```json
// 在子项目的 package.json 中
{
  "devDependencies": {
    "eslint": "^9.37.0",
    "@your-scope/eslint-config": "workspace:*"
  },
  "pnpm": {
    "overrides": {
      "eslint": "^9.37.0"
    }
  }
}
```

### 问题 3: 配置不生效

**解决方案**:
```javascript
// 检查配置文件名
// ✅ eslint.config.js (ESLint v9+)
// ❌ .eslintrc.js (旧版本)

// 检查导出格式
export default config  // ✅
module.exports = config  // ❌ (除非使用 CJS)
```

## 📊 性能优化

### 1. 缓存配置

```javascript
// eslint.config.js
import config from '@your-scope/eslint-config'

export default config({
  // 启用缓存
  cache: true,

  // 排除大文件
  ignores: [
    '**/*.min.js',
    '**/dist/**',
    '**/node_modules/**',
  ],
})
```

### 2. 并行执行

```json
{
  "scripts": {
    "lint": "pnpm -r --parallel lint",
    "lint:fix": "pnpm -r --parallel lint:fix"
  }
}
```

### 3. 增量检查

```bash
# 只检查变更的文件
pnpm lint --staged

# 或使用 lint-staged
pnpm add -D lint-staged
```

## 🚀 发布配置包

### 1. 准备发布

```bash
# 确保构建完成
cd packages/eslint-config
pnpm build

# 检查文件
ls dist/
# 应该有: cjs/index.cjs, es/index.mjs, index.d.ts
```

### 2. 发布到私有仓库

```bash
# 登录仓库
pnpm login

# 发布
pnpm publish --access restricted
```

### 3. 在子项目中使用

```json
{
  "devDependencies": {
    "@your-scope/eslint-config": "^1.0.0"
  }
}
```

## 📖 文档模板

**packages/eslint-config/README.md**:
```markdown
# @your-scope/eslint-config

Shared ESLint configuration for workspace projects.

## Installation

```bash
pnpm add -D @your-scope/eslint-config eslint
```

## Usage

```javascript
// eslint.config.js
import config from '@your-scope/eslint-config'

export default config({
  typescript: true,
  react: true,
  rules: {
    // Your custom rules
  }
})
```

## Options

- `typescript`: Enable TypeScript support
- `react`: Enable React support
- `vue`: Enable Vue support
- `rules`: Custom ESLint rules
- `ignores`: Files to ignore

## Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## License

MIT
```

---

**总结**：Workspace 配置方案提供了代码复用、统一标准、集中管理的优势，适合多项目的团队开发。