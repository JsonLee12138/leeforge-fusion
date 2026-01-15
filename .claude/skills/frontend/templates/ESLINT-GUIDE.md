# ESLint 配置完整指南

> 快速选择和配置 ESLint，支持非 Workspace 和 Workspace 两种方案

## 🎯 快速选择

### 我应该使用哪种配置？

| 场景 | 推荐配置 | 原因 |
|------|---------|------|
| 独立 React/Vue 项目 | **非 Workspace** | 简单快速，开箱即用 |
| 多项目 Monorepo | **Workspace** | 代码复用，统一标准 |
| 个人小项目 | **非 Workspace** | 配置简单，易于维护 |
| 团队大项目 | **Workspace** | 集中管理，减少重复 |
| 开源库/组件库 | **Workspace** | 版本控制，统一规范 |

### 一句话决策

- **1 个项目** → 非 Workspace
- **2+ 个项目** → Workspace
- **需要复用配置** → Workspace
- **快速开始** → 非 Workspace

## 🚀 5 分钟开始

### 方案 A: 非 Workspace (推荐新手)

```bash
# 1. 运行配置脚本
node frontend/templates/scripts/setup-eslint.js --type non-workspace

# 2. 安装依赖
pnpm install

# 3. 测试
pnpm lint
```

**完成！** 🎉

### 方案 B: Workspace (推荐团队)

```bash
# 1. 运行配置脚本
node frontend/templates/scripts/setup-eslint.js --type workspace --scope @yourcompany

# 2. 安装依赖
pnpm install

# 3. 构建配置包
pnpm run lint:eslint-config

# 4. 在子项目中使用
cd apps/my-app
pnpm add -D @yourcompany/eslint-config
```

**完成！** 🎉

## 📋 详细对比

### 非 Workspace 配置

**文件结构:**
```
project/
├── eslint.config.js          # 主配置文件
├── package.json              # 添加 lint 脚本
└── .eslintignore            # 忽略文件
```

**优点:**
- ✅ 配置简单，5 分钟完成
- ✅ 无需额外构建步骤
- ✅ 适合独立项目
- ✅ 学习成本低

**缺点:**
- ❌ 配置无法复用
- ❌ 多项目需要重复配置
- ❌ 更新配置需要逐个项目修改

**适合场景:**
- 单页应用
- 个人项目
- 小型团队 (1-2 个项目)
- 快速原型

### Workspace 配置

**文件结构:**
```
workspace/
├── packages/
│   └── eslint-config/
│       ├── src/index.ts
│       ├── package.json
│       ├── tsdown.config.ts
│       └── dist/ (构建后)
├── apps/
│   ├── app1/
│   │   └── eslint.config.js
│   └── app2/
│       └── eslint.config.js
└── pnpm-workspace.yaml
```

**优点:**
- ✅ 配置一次，多处复用
- ✅ 统一团队标准
- ✅ 版本控制
- ✅ 易于更新和维护

**缺点:**
- ❌ 初始配置较复杂
- ❌ 需要构建步骤
- ❌ 学习成本较高

**适合场景:**
- Monorepo 项目
- 多应用项目
- 组件库开发
- 团队协作项目

## 🔧 配置文件详解

### 非 Workspace 配置 (eslint.config.js)

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  // 核心配置
  typescript: true,      // TypeScript 支持
  react: true,          // React 支持 (或 vue: true)
  formatters: true,     // 启用格式化

  // 代码风格
  stylistic: {
    indent: 2,          // 2 空格缩进
    quotes: 'single',   // 单引号
    semi: false,        // 无分号
    trailingComma: 'all', // 尾随逗号
  },

  // 自定义规则
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off', // Next.js 需要
    'react/prop-types': 'off', // 使用 TypeScript
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

### Workspace 配置 (packages/eslint-config/src/index.ts)

```typescript
import antfu from '@antfu/eslint-config'

type Options = Parameters<typeof antfu>[0]

export default (options: Options = {}) => {
  // 默认样式
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    semi: false,
    trailingComma: 'all',
  } as any

  // 合并自定义样式
  if (typeof options.stylistic === 'object') {
    Object.assign(stylisticConfig, options.stylistic)
    delete options.stylistic
  }

  // 返回配置
  return antfu({
    formatters: true,
    stylistic: stylisticConfig,
    typescript: true,
    react: true,
    ...options,
  })
}
```

**子项目使用:**
```javascript
// apps/my-app/eslint.config.js
import config from '@yourcompany/eslint-config'

export default config({
  // 覆盖默认配置
  rules: {
    'no-console': 'warn',
  },
})
```

## 🛠️ 常用命令

### 非 Workspace

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm lint:fix

# 检查特定文件
npx eslint src/index.ts

# 查看配置
npx eslint --print-config index.js
```

### Workspace

```bash
# 根目录: 检查所有子项目
pnpm lint

# 根目录: 修复所有子项目
pnpm lint:fix

# 根目录: 重新构建配置包
pnpm lint:eslint-config

# 子项目: 检查
cd apps/my-app && pnpm lint

# 配置包: 开发模式
cd packages/eslint-config && pnpm run dev
```

## 🔍 故障排除

### 问题 1: 配置不生效

**检查清单:**
- [ ] 配置文件名是 `eslint.config.js` (不是 `.eslintrc.js`)
- [ ] 使用 `export default` 导出 (不是 `module.exports`)
- [ ] 文件在项目根目录
- [ ] 运行命令在正确目录

**测试命令:**
```bash
# 检查配置是否被读取
npx eslint --print-config index.js

# 检查特定文件
npx eslint src/index.ts --debug
```

### 问题 2: TypeScript 报错

**解决方案:**
```bash
# 确保安装 TypeScript
pnpm add -D typescript

# 确保有 tsconfig.json
npx tsc --init

# 检查配置
cat eslint.config.js | grep typescript
```

### 问题 3: Workspace 包找不到

**解决方案:**
```bash
# 1. 确保已构建
cd packages/eslint-config
pnpm build

# 2. 确保已链接
cd workspace-root
pnpm install

# 3. 检查是否安装
pnpm list @yourcompany/eslint-config
```

## 📊 配置对比表

| 特性 | 非 Workspace | Workspace |
|------|-------------|-----------|
| **配置时间** | 5 分钟 | 15 分钟 |
| **学习曲线** | 平缓 | 陡峭 |
| **复用性** | 无 | 完美 |
| **维护成本** | 高 (多项目) | 低 (集中) |
| **版本控制** | 无 | 有 |
| **适合项目数** | 1-2 个 | 3+ 个 |
| **团队协作** | 一般 | 优秀 |
| **CI/CD** | 简单 | 需要构建 |

## 🎨 自定义配置

### 添加自定义规则

**非 Workspace:**
```javascript
export default antfu({
  // ... 其他配置
  rules: {
    'no-console': 'warn',
    'your-custom-rule': 'error',
  },
})
```

**Workspace:**
```javascript
// 在子项目中
export default config({
  rules: {
    'no-console': 'warn',
  },
})
```

### 更改代码风格

**非 Workspace:**
```javascript
export default antfu({
  stylistic: {
    indent: 4,      // 改为 4 空格
    quotes: 'double', // 改为双引号
    semi: true,     // 加分号
  },
})
```

**Workspace:**
```javascript
// 修改 packages/eslint-config/src/index.ts
const stylisticConfig = {
  indent: 4,
  quotes: 'double',
  semi: true,
}
```

### 支持 Vue

**非 Workspace:**
```javascript
export default antfu({
  vue: true,  // 改为 true
  react: false,
})
```

**Workspace:**
```javascript
// 在子项目中
export default config({
  react: false,
  vue: true,
})
```

## 📦 依赖管理

### 非 Workspace 依赖

```json
{
  "devDependencies": {
    "eslint": "^9.37.0",
    "@antfu/eslint-config": "^6.0.0"
  }
}
```

### Workspace 依赖

**根目录:**
```json
{
  "devDependencies": {
    "eslint": "^9.37.0",
    "typescript": "^5.7.0"
  }
}
```

**配置包:**
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

**子项目:**
```json
{
  "devDependencies": {
    "@yourcompany/eslint-config": "workspace:*",
    "eslint": "^9.37.0"
  }
}
```

## 🎯 最佳实践

### 1. 选择合适的配置

**新手/小项目** → 非 Workspace
```bash
node setup-eslint.js --type non-workspace
```

**团队/大项目** → Workspace
```bash
node setup-eslint.js --type workspace --scope @yourcompany
```

### 2. 版本控制

**非 Workspace:**
```bash
git add eslint.config.js .eslintignore
git commit -m "chore: add eslint config"
```

**Workspace:**
```bash
git add packages/eslint-config/
git commit -m "feat(eslint-config): add shared config package"
```

### 3. 团队协作

**非 Workspace:**
- 在文档中说明配置
- 确保所有成员使用相同配置
- 定期同步配置更新

**Workspace:**
- 发布配置包到私有仓库
- 在 README 中说明使用方法
- 版本更新时通知团队

### 4. CI/CD 集成

**非 Workspace:**
```yaml
# .github/workflows/lint.yml
- name: Run ESLint
  run: pnpm lint
```

**Workspace:**
```yaml
# .github/workflows/lint.yml
- name: Build ESLint Config
  run: pnpm run lint:eslint-config

- name: Run ESLint
  run: pnpm lint
```

## 🔧 工具和脚本

### 快速切换脚本

```bash
# 切换到非 Workspace 配置
node frontend/templates/scripts/quick-switch.js non-workspace

# 切换到 Workspace 配置
node frontend/templates/scripts/quick-switch.js workspace
```

### 验证脚本

```bash
# 检查配置是否正确
node frontend/templates/scripts/validate-eslint.js
```

## 📚 参考资源

- [Antfu ESLint Config](https://github.com/antfu/eslint-config)
- [ESLint v9 文档](https://eslint.org/docs/latest/)
- [Flat Config 指南](https://eslint.org/docs/latest/use/configure/configuration-files-new)

## 🎉 总结

### 选择指南

**使用非 Workspace 如果:**
- ✅ 只有 1-2 个项目
- ✅ 需要快速开始
- ✅ 个人项目
- ✅ 不熟悉 Monorepo

**使用 Workspace 如果:**
- ✅ 3+ 个项目
- ✅ 团队协作
- ✅ 需要配置复用
- ✅ 长期维护

### 快速决策树

```
项目数量 ≤ 2?
├── 是 → 非 Workspace
└── 否 → 需要配置复用?
    ├── 是 → Workspace
    └── 否 → 非 Workspace
```

---

**记住**: 选择适合你当前需求的配置，未来可以迁移！

**开始吧**: 运行 `node frontend/templates/scripts/setup-eslint.js --help` 查看详细用法