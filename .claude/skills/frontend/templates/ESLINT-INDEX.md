# ESLint 配置方案索引

> 快速导航到你需要的 ESLint 配置方案

## 📖 文档导航

### 🎯 快速开始
- **[ESLINT-QUICK-CARD.md](./ESLINT-QUICK-CARD.md)** - 速查卡，5 分钟快速参考
- **[ESLINT-GUIDE.md](./ESLINT-GUIDE.md)** - 完整指南，详细说明和最佳实践

### 🔧 配置方案
- **[eslint-config-non-workspace.md](./eslint-config-non-workspace.md)** - 非 Workspace 配置
- **[eslint-config-workspace.md](./eslint-config-workspace.md)** - Workspace 配置

### 🛠️ 自动化脚本
- **[scripts/setup-eslint.js](./scripts/setup-eslint.js)** - 一键配置脚本
- **[scripts/quick-switch.js](./scripts/quick-switch.js)** - 快速切换配置

## 🚀 快速决策

### 我该用哪个？

**非 Workspace** (简单快速)
```bash
node frontend/templates/scripts/setup-eslint.js --type non-workspace
```
适合：独立项目、个人项目、快速开始

**Workspace** (复用性强)
```bash
node frontend/templates/scripts/setup-eslint.js --type workspace --scope @yourcompany
```
适合：Monorepo、团队项目、多应用

## 📋 对比一览

| 特性 | 非 Workspace | Workspace |
|------|-------------|-----------|
| 配置时间 | 5 分钟 | 15 分钟 |
| 配置文件 | `eslint.config.js` | `packages/eslint-config/` |
| 复用性 | ❌ 无 | ✅ 完美 |
| 维护成本 | 高 (多项目) | 低 (集中) |
| 适合项目数 | 1-2 个 | 3+ 个 |
| 学习曲线 | 平缓 | 陡峭 |

## 🎯 使用场景

### 场景 1: 新项目
```
我是新手，只有一个项目 → 非 Workspace
```

### 场景 2: 团队项目
```
我们有 5 个应用，需要统一标准 → Workspace
```

### 场景 3: 组件库
```
要开发共享组件库 → Workspace
```

### 场景 4: 快速原型
```
需要快速搭建环境 → 非 Workspace
```

## 🔧 核心配置

### 非 Workspace 配置 (eslint.config.js)
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

### Workspace 配置 (子项目)
```javascript
// eslint.config.js
import config from '@yourcompany/eslint-config'

export default config({
  rules: {
    'no-console': 'warn',
  },
})
```

## 📦 依赖安装

### 非 Workspace
```bash
pnpm add -D eslint @antfu/eslint-config
```

### Workspace
```bash
# 根目录
pnpm add -D eslint

# 配置包
cd packages/eslint-config
pnpm add @antfu/eslint-config eslint-plugin-format
pnpm add -D eslint tsdown

# 子项目
cd apps/my-app
pnpm add -D @yourcompany/eslint-config eslint
```

## 🎨 配置选项

### 常用框架
- **React**: `react: true`
- **Vue**: `vue: true`
- **Node.js**: `react: false, vue: false`

### 代码风格
- **缩进**: 2 空格
- **引号**: 单引号
- **分号**: 无
- **尾随逗号**: all

### 自定义规则
```javascript
rules: {
  'no-console': 'warn',
  '@typescript-eslint/no-explicit-any': 'off',
  'react/react-in-jsx-scope': 'off',
}
```

## 🛠️ 常用命令

### 检查和修复
```bash
pnpm lint          # 检查代码
pnpm lint:fix      # 自动修复
```

### Workspace 特定
```bash
pnpm lint                    # 检查所有子项目
pnpm lint:eslint-config      # 构建配置包
cd packages/eslint-config && pnpm dev  # 开发模式
```

### 测试配置
```bash
npx eslint --print-config index.js  # 查看配置
npx eslint src/index.ts             # 检查文件
npx eslint . --fix                  # 修复所有
```

## 🔍 故障排除

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 配置不生效 | 文件名错误 | 使用 `eslint.config.js` |
| TypeScript 报错 | 缺少依赖 | `pnpm add -D typescript` |
| 找不到包 | 未构建 | `cd packages/eslint-config && pnpm build` |
| 规则不生效 | 配置错误 | 检查 `rules` 配置 |

## 📚 更多资源

### 外部文档
- [Antfu ESLint Config](https://github.com/antfu/eslint-config)
- [ESLint v9 文档](https://eslint.org/docs/latest/)
- [Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)

### 内部文档
- **完整标准**: `frontend/docs/standards.md`
- **设置指南**: `frontend/docs/setup-guide.md`
- **技能使用**: `frontend/skills/CLAUDE_USAGE.md`

## 💡 最佳实践

### 1. 选择合适的配置
- 1-2 个项目 → 非 Workspace
- 3+ 个项目 → Workspace

### 2. 版本控制
```bash
# 非 Workspace
git add eslint.config.js

# Workspace
git add packages/eslint-config/
```

### 3. 团队协作
- 非 Workspace: 文档化配置
- Workspace: 发布配置包

### 4. CI/CD
```yaml
# 非 Workspace
- run: pnpm lint

# Workspace
- run: pnpm run lint:eslint-config
- run: pnpm lint
```

## 🎉 开始使用

### 第一步：选择配置类型
```
独立项目? → 非 Workspace
Monorepo? → Workspace
```

### 第二步：运行配置脚本
```bash
# 非 Workspace
node frontend/templates/scripts/setup-eslint.js --type non-workspace

# Workspace
node frontend/templates/scripts/setup-eslint.js --type workspace --scope @yourcompany
```

### 第三步：测试
```bash
pnpm lint
```

### 第四步：完成！🎉

## 📞 获取帮助

### 遇到问题？
1. 查看 [ESLINT-GUIDE.md](./ESLINT-GUIDE.md) 故障排除部分
2. 检查 [ESLINT-QUICK-CARD.md](./ESLINT-QUICK-CARD.md) 常见问题
3. 查看脚本帮助: `node setup-eslint.js --help`

### 需要更多帮助？
- 阅读完整指南: [ESLINT-GUIDE.md](./ESLINT-GUIDE.md)
- 使用速查卡: [ESLINT-QUICK-CARD.md](./ESLINT-QUICK-CARD.md)
- 查看现有配置: `frontend/assets/eslint-config/`

---

**记住**: 选择适合你当前需求的配置，未来可以迁移！

**快速开始**: 运行 `node frontend/templates/scripts/setup-eslint.js --help`