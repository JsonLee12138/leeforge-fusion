# @your-scope/eslint-config

共享的 ESLint 配置包，用于 workspace/monorepo 项目。

## 安装

在 workspace 根目录或子项目中安装：

```bash
pnpm add -D @your-scope/eslint-config
```

## 使用

### 1. 构建配置包

在配置包目录运行：

```bash
pnpm build
```

### 2. 在子项目中配置

创建 `eslint.config.js`：

```javascript
import config from '@your-scope/eslint-config'

export default config({
  // 子项目特定配置
  typescript: true,
  react: true,
  rules: {
    // 自定义规则
    '@typescript-eslint/no-explicit-any': 'off',
  }
})
```

### 3. 添加脚本

在子项目的 `package.json` 中：

```json
{
  "scripts": {
    "lint": "eslint --fix .",
    "lint:check": "eslint ."
  }
}
```

## 配置选项

支持所有 `@antfu/eslint-config` 的选项：

```javascript
export default config({
  // TypeScript 支持
  typescript: true,

  // React 支持
  react: true,

  // 自定义样式
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  // 自定义规则
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
  },

  // 其他选项
  ignores: ['**/dist/**', '**/node_modules/**'],
})
```

## 开发

### 目录结构

```
eslint-config/
├── src/
│   └── index.ts          # 主配置文件
├── eslint.config.js      # 本地开发配置
├── tsdown.config.ts      # 构建配置
├── package.json
└── README.md
```

### 脚本命令

```bash
# 开发模式（监听文件变化）
pnpm dev

# 构建
pnpm build

# 本地检查
pnpm lint
```

## 特性

- ✅ 基于 `@antfu/eslint-config`
- ✅ 支持 TypeScript 和 React
- ✅ 统一的代码风格配置
- ✅ 支持子项目自定义配置
- ✅ 支持 ESM 和 CJS 双格式
- ✅ 自动生成类型定义

## 更新配置

修改 `src/index.ts` 后，需要重新构建：

```bash
pnpm build
```

然后在子项目中更新依赖：

```bash
pnpm update @your-scope/eslint-config
```

## 许可证

MIT