# ESLint 配置方案完整文档

> 固定 ESLint 配置：非 Workspace 使用 @antfu/eslint-config，Workspace 封装到 packages

## 📋 项目概述

### 配置原则
- ✅ **固定使用 ESLint** (不使用其他 linter)
- ✅ **非 Workspace**: 直接使用 `@antfu/eslint-config`
- ✅ **Workspace**: 封装为独立包，在 `packages/` 中管理
- ✅ **统一标准**: 2 空格缩进、单引号、无分号

### 文件结构
```
frontend/templates/
├── ESLINT-SETUP.md           # 本文档
├── ESLINT-INDEX.md           # 索引导航
├── ESLINT-GUIDE.md           # 完整指南
├── ESLINT-QUICK-CARD.md      # 速查卡
├── eslint-config-non-workspace.md  # 非 Workspace 详解
├── eslint-config-workspace.md      # Workspace 详解
└── scripts/
    ├── setup-eslint.js       # 一键配置脚本
    └── quick-switch.js       # 快速切换脚本
```

## 🎯 配置方案对比

### 方案 A: 非 Workspace
**适用场景**: 独立项目、个人项目、快速开始

**配置文件**: `eslint.config.js`
```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  rules: {
    'no-console': 'warn',
  },
})
```

**优点**:
- ⭐⭐⭐⭐⭐ 配置简单
- ⭐⭐⭐⭐⭐ 开箱即用
- ⭐⭐⭐⭐⭐ 无需构建

**缺点**:
- ❌ 无法复用
- ❌ 多项目重复配置

### 方案 B: Workspace
**适用场景**: Monorepo、团队项目、多应用

**配置包**: `packages/eslint-config/`
```typescript
// packages/eslint-config/src/index.ts
import antfu from '@antfu/eslint-config'

export default (options = {}) => {
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    semi: false,
  }

  return antfu({
    formatters: true,
    stylistic: stylisticConfig,
    typescript: true,
    react: true,
    ...options,
  })
}
```

**子项目使用**:
```javascript
// apps/my-app/eslint.config.js
import config from '@yourcompany/eslint-config'

export default config({
  rules: {
    'no-console': 'warn',
  },
})
```

**优点**:
- ⭐⭐⭐⭐⭐ 配置复用
- ⭐⭐⭐⭐⭐ 统一标准
- ⭐⭐⭐⭐⭐ 易于维护

**缺点**:
- ❌ 初始配置复杂
- ❌ 需要构建步骤

## 🚀 快速开始

### 步骤 1: 选择配置类型

**问自己**:
- 我只有一个项目吗？→ 非 Workspace
- 我有多个项目吗？→ Workspace
- 我需要配置复用吗？→ Workspace
- 我想快速开始吗？→ 非 Workspace

### 步骤 2: 运行配置脚本

**非 Workspace**:
```bash
node frontend/templates/scripts/setup-eslint.js --type non-workspace
```

**Workspace**:
```bash
node frontend/templates/scripts/setup-eslint.js --type workspace --scope @yourcompany
```

### 步骤 3: 安装依赖

**非 Workspace**:
```bash
pnpm install
```

**Workspace**:
```bash
# 根目录
pnpm install

# 配置包
cd packages/eslint-config
pnpm install
pnpm build
```

### 步骤 4: 测试

```bash
pnpm lint
```

## 📦 依赖管理

### 非 Workspace 依赖
```json
{
  "devDependencies": {
    "eslint": "^9.37.0",
    "@antfu/eslint-config": "^6.0.0"
  },
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Workspace 依赖

**根目录**:
```json
{
  "devDependencies": {
    "eslint": "^9.37.0",
    "typescript": "^5.7.0"
  },
  "scripts": {
    "lint": "pnpm -r --parallel lint",
    "lint:eslint-config": "cd packages/eslint-config && pnpm build"
  }
}
```

**配置包**:
```json
{
  "dependencies": {
    "@antfu/eslint-config": "^6.0.0",
    "eslint-plugin-format": "^1.0.2"
  },
  "devDependencies": {
    "eslint": "^9.37.0",
    "tsdown": "^0.15.9"
  }
}
```

**子项目**:
```json
{
  "devDependencies": {
    "@yourcompany/eslint-config": "workspace:*",
    "eslint": "^9.37.0"
  },
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## 🔧 配置详解

### 非 Workspace 配置选项

```javascript
export default antfu({
  // 框架支持
  typescript: true,  // TypeScript
  react: true,       // React (或 vue: true)
  vue: false,        // Vue

  // 格式化
  formatters: true,  // 启用 Prettier

  // 代码风格
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    trailingComma: 'all',
  },

  // 自定义规则
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },

  // 忽略文件
  ignores: [
    'dist/',
    'build/',
    'node_modules/',
    'coverage/',
    '*.min.js',
    '*.config.js',
    '*.d.ts',
  ],
})
```

### Workspace 配置选项

```typescript
export default (options: Options = {}) => {
  // 默认配置
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    semi: false,
  }

  // 合并自定义配置
  if (typeof options.stylistic === 'object') {
    Object.assign(stylisticConfig, options.stylistic)
  }

  // 返回最终配置
  return antfu({
    formatters: true,
    stylistic: stylisticConfig,
    typescript: true,
    react: true,
    ...options,
  })
}
```

**子项目使用**:
```javascript
export default config({
  // 覆盖默认
  react: false,
  vue: true,

  // 自定义规则
  rules: {
    'no-console': 'warn',
  },

  // 自定义忽略
  ignores: ['custom/'],
})
```

## 🎨 常用配置示例

### React 项目
```javascript
// 非 Workspace
export default antfu({
  typescript: true,
  react: true,
  formatters: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
})

// Workspace
export default config({ react: true })
```

### Vue 项目
```javascript
// 非 Workspace
export default antfu({
  typescript: true,
  vue: true,
  react: false,
  formatters: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
})

// Workspace
export default config({ react: false, vue: true })
```

### Node.js 项目
```javascript
// 非 Workspace
export default antfu({
  typescript: true,
  formatters: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
})

// Workspace
export default config({ react: false, vue: false })
```

## 🛠️ 常用命令

### 非 Workspace
```bash
# 检查
pnpm lint

# 修复
pnpm lint:fix

# 检查特定文件
npx eslint src/index.ts

# 查看配置
npx eslint --print-config index.js
```

### Workspace
```bash
# 根目录
pnpm lint                    # 检查所有子项目
pnpm lint:fix                # 修复所有子项目
pnpm lint:eslint-config      # 构建配置包

# 配置包
cd packages/eslint-config
pnpm build                   # 构建
pnpm dev                     # 开发模式

# 子项目
cd apps/my-app
pnpm lint                    # 检查
pnpm lint:fix                # 修复
```

## 🔍 故障排除

### 常见问题

**1. 配置不生效**
```bash
# 检查文件名
ls eslint.config.js  # ✅ 必须是这个

# 检查导出
cat eslint.config.js | grep export  # ✅ 必须是 export default

# 测试配置
npx eslint --print-config index.js
```

**2. TypeScript 报错**
```bash
# 安装 TypeScript
pnpm add -D typescript

# 生成配置
npx tsc --init

# 检查配置
cat tsconfig.json
```

**3. Workspace 包找不到**
```bash
# 确保已构建
cd packages/eslint-config
pnpm build

# 确保已链接
cd ../..
pnpm install

# 检查
pnpm list @yourcompany/eslint-config
```

**4. 规则不生效**
```javascript
// 检查配置文件
cat eslint.config.js

// 确保规则在 rules 中
rules: {
  'no-console': 'warn',  // ✅
}

// 不是这样
no-console: 'warn'  // ❌
```

## 📊 性能优化

### 1. 缓存
```javascript
export default antfu({
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
    "lint": "pnpm -r --parallel lint"
  }
}
```

### 3. 增量检查
```bash
# 只检查变更的文件 (需要 lint-staged)
pnpm add -D lint-staged
```

## 🎯 最佳实践

### 1. 选择原则
- **1-2 个项目**: 非 Workspace
- **3+ 个项目**: Workspace
- **需要复用**: Workspace
- **快速开始**: 非 Workspace

### 2. 版本控制
```bash
# 非 Workspace
git add eslint.config.js .eslintignore
git commit -m "chore: add eslint config"

# Workspace
git add packages/eslint-config/
git commit -m "feat(eslint-config): add shared config"
```

### 3. 团队协作
- 非 Workspace: 在 README 中说明配置
- Workspace: 发布到私有仓库，文档化使用方法

### 4. CI/CD 集成
```yaml
# 非 Workspace
- name: Lint
  run: pnpm lint

# Workspace
- name: Build Config
  run: pnpm run lint:eslint-config
- name: Lint
  run: pnpm lint
```

## 📚 扩展阅读

### 内部文档
- **完整指南**: `ESLINT-GUIDE.md`
- **速查卡**: `ESLINT-QUICK-CARD.md`
- **索引导航**: `ESLINT-INDEX.md`
- **非 Workspace 详解**: `eslint-config-non-workspace.md`
- **Workspace 详解**: `eslint-config-workspace.md`

### 外部资源
- [Antfu ESLint Config](https://github.com/antfu/eslint-config)
- [ESLint v9 文档](https://eslint.org/docs/latest/)
- [Flat Config 指南](https://eslint.org/docs/latest/use/configure/configuration-files-new)

## 🎉 总结

### 核心要点

1. **固定 ESLint**: 只使用 ESLint，不使用其他 linter
2. **两种方案**:
   - 非 Workspace: `@antfu/eslint-config` 直接使用
   - Workspace: 封装为 `packages/eslint-config`
3. **统一标准**: 2 空格、单引号、无分号
4. **自动化**: 提供一键配置脚本

### 选择建议

| 情况 | 推荐 | 命令 |
|------|------|------|
| 新手/小项目 | 非 Workspace | `setup-eslint.js --type non-workspace` |
| 团队/大项目 | Workspace | `setup-eslint.js --type workspace --scope @xxx` |
| 快速原型 | 非 Workspace | `setup-eslint.js --type non-workspace` |
| Monorepo | Workspace | `setup-eslint.js --type workspace --scope @xxx` |

### 下一步

1. **阅读速查卡**: `ESLINT-QUICK-CARD.md`
2. **运行脚本**: `node frontend/templates/scripts/setup-eslint.js --help`
3. **开始配置**: 选择适合你的方案

---

**记住**: 配置是为了提高开发效率，选择最适合你当前需求的方案！

**开始吧**: `node frontend/templates/scripts/setup-eslint.js --type non-workspace`