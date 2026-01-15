# ESLint 配置方案：非 Workspace 项目

> 使用 `@antfu/eslint-config` 作为基础配置，适用于独立项目或简单应用

## 📋 快速开始

### 1. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm add -D eslint @antfu/eslint-config

# 使用 npm
npm install --save-dev eslint @antfu/eslint-config

# 使用 yarn
yarn add -D eslint @antfu/eslint-config
```

### 2. 创建配置文件

在项目根目录创建 `eslint.config.js`：

```javascript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  // TypeScript 支持
  typescript: true,

  // React 支持
  react: true,

  // 格式化配置
  formatters: true,

  // 代码风格配置
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,  // 无分号
    trailingComma: 'all',
  },

  // 自定义规则
  rules: {
    // 你的自定义规则
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
  },

  // 忽略文件
  ignores: [
    'dist/',
    'node_modules/',
    '*.min.js',
    'coverage/',
  ],
})
```

### 3. 添加脚本到 package.json

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## 🎯 配置选项

### 基础配置

```javascript
export default antfu({
  // TypeScript 项目
  typescript: true,

  // React 项目
  react: true,

  // Vue 项目
  vue: true,

  // 启用格式化
  formatters: true,

  // 自动修复
  autoFix: true,
})
```

### 自定义样式

```javascript
export default antfu({
  stylistic: {
    indent: 2,           // 缩进
    quotes: 'single',    // 单引号
    semi: false,         // 无分号
    commaDangle: 'all',  // 尾随逗号
    jsxQuotes: 'single', // JSX 单引号
  },
})
```

### 自定义规则

```javascript
export default antfu({
  rules: {
    // 禁止 console
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // TypeScript 特定规则
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',

    // React 特定规则
    'react/react-in-jsx-scope': 'off', // Next.js 不需要
    'react/prop-types': 'off', // 使用 TypeScript
  },
})
```

## 📝 完整示例

### React + TypeScript 项目

```javascript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  react: true,
  formatters: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    trailingComma: 'all',
  },

  rules: {
    // 最佳实践
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'warn',

    // 性能
    'react/no-array-index-key': 'warn',
  },

  ignores: [
    'dist/',
    'build/',
    'node_modules/',
    'coverage/',
    '*.config.js',
    '*.d.ts',
  ],
})
```

### Vue + TypeScript 项目

```javascript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  formatters: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',

    // Vue 特定规则
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
  },
})
```

### Node.js + TypeScript 项目

```javascript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  formatters: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
})
```

## 🔧 常用配置组合

### 1. 严格模式

```javascript
export default antfu({
  typescript: true,
  react: true,
  formatters: true,

  rules: {
    // 严格 TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',

    // 严格 React
    'react-hooks/exhaustive-deps': 'error',
    'react/no-unstable-nested-components': 'error',
  },
})
```

### 2. 宽松模式

```javascript
export default antfu({
  typescript: true,
  react: true,
  formatters: true,

  rules: {
    // 宽松规则
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': 'off',
  },
})
```

### 3. 生产环境专用

```javascript
import antfu from '@antfu/eslint-config'

const isProduction = process.env.NODE_ENV === 'production'

export default antfu({
  typescript: true,
  react: true,
  formatters: true,

  rules: {
    // 生产环境严格
    'no-console': isProduction ? 'error' : 'warn',
    'no-debugger': isProduction ? 'error' : 'warn',

    // 性能优化
    'react/no-direct-mutation-state': 'error',
    'react/no-array-index-key': isProduction ? 'error' : 'warn',
  },
})
```

## 🎨 样式配置参考

### 缩进和空格

```javascript
stylistic: {
  indent: 2,                    // 2 空格缩进
  quotes: 'single',             // 单引号
  semi: false,                  // 无分号
  commaDangle: 'all',           // 尾随逗号
  jsxQuotes: 'single',          // JSX 单引号
  braceStyle: '1tbs',           // 大括号风格
  arrowParens: 'always',        // 箭头函数括号
  spaceBeforeFunctionParen: true, // 函数括号前空格
}
```

### 导入/导出

```javascript
stylistic: {
  importSort: true,             // 导入排序
  importSpacing: true,          // 导入间距
  multilineImportStyle: 'multi-line', // 多行导入
}
```

## 📦 依赖管理

### package.json 推荐配置

```json
{
  "devDependencies": {
    "eslint": "^9.0.0",
    "@antfu/eslint-config": "^6.0.0"
  },
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:report": "eslint . --format json > eslint-report.json"
  }
}
```

### .eslintignore (可选)

虽然推荐在配置文件中使用 `ignores`，但也可以使用 `.eslintignore`：

```
dist/
build/
node_modules/
coverage/
*.min.js
*.config.js
*.d.ts
```

## 🔍 测试配置

### 1. 验证配置

```bash
# 检查配置是否正确
npx eslint --print-config index.js

# 检查特定文件
npx eslint src/index.ts

# 自动修复
npx eslint . --fix
```

### 2. 常见问题

**问题：配置不生效**
```bash
# 确保使用 eslint.config.js (ESLint v9+)
# 而不是 .eslintrc.js 或 .eslintrc.json
```

**问题：TypeScript 报错**
```bash
# 确保安装了 TypeScript
pnpm add -D typescript

# 确保 tsconfig.json 存在
npx tsc --init
```

## 🎯 最佳实践

### 1. 项目结构

```
project/
├── src/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── eslint.config.js
├── package.json
├── tsconfig.json
└── .gitignore
```

### 2. 配置文件位置

- ✅ **推荐**：项目根目录的 `eslint.config.js`
- ❌ **不推荐**：嵌套配置文件（除非有特殊需求）

### 3. 与编辑器集成

**VS Code**:
1. 安装 ESLint 扩展
2. 设置 `"eslint.useFlatConfig": true`
3. 重启编辑器

**WebStorm**:
1. Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. 选择 "Automatic"
3. 启用 "Run eslint on save"

## 📊 配置对比

| 特性 | @antfu/eslint-config | 手动配置 |
|------|---------------------|----------|
| 安装复杂度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 维护成本 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 自定义灵活性 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 开箱即用 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 学习曲线 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

## 🚀 迁移指南

### 从旧配置迁移

```javascript
// 旧配置 (.eslintrc.js)
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    // 你的规则
  }
}

// 新配置 (eslint.config.js)
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  react: true,
  rules: {
    // 你的规则（保持不变）
  }
})
```

## 📚 参考资源

- [Antfu ESLint Config 文档](https://github.com/antfu/eslint-config)
- [ESLint v9 迁移指南](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Flat Config 说明](https://eslint.org/docs/latest/use/configure/configuration-files-new)

---

**总结**：对于非 Workspace 项目，`@antfu/eslint-config` 提供了开箱即用的优秀配置，只需少量自定义即可满足大多数项目需求。