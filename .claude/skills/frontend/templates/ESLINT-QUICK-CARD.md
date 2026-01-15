# ESLint 配置速查卡

## 🚀 一键配置

### 非 Workspace
```bash
node frontend/templates/scripts/setup-eslint.js --type non-workspace
```

### Workspace
```bash
node frontend/templates/scripts/setup-eslint.js --type workspace --scope @yourcompany
```

## 📋 配置对比

| 类型 | 适合 | 配置文件 | 优点 |
|------|------|----------|------|
| **非 Workspace** | 1-2 个项目 | `eslint.config.js` | 简单快速 |
| **Workspace** | 3+ 个项目 | `packages/eslint-config/` | 复用性强 |

## 🔧 常用命令

### 非 Workspace
```bash
pnpm lint          # 检查
pnpm lint:fix      # 修复
```

### Workspace
```bash
pnpm lint                    # 检查所有
pnpm lint:eslint-config      # 构建配置包
cd packages/eslint-config && pnpm dev  # 开发模式
```

## ⚡ 快速决策

**选非 Workspace 如果:**
- 个人项目
- 快速开始
- 项目数量 ≤ 2

**选 Workspace 如果:**
- 团队项目
- Monorepo
- 项目数量 ≥ 3

## 📝 配置模板

### 非 Workspace (eslint.config.js)
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
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
```

### Workspace (子项目使用)
```javascript
// eslint.config.js
import config from '@yourcompany/eslint-config'

export default config({
  rules: {
    'no-console': 'warn',
  },
})
```

## 🎯 故障排除

| 问题 | 解决方案 |
|------|----------|
| 配置不生效 | 检查文件名是否为 `eslint.config.js` |
| TypeScript 报错 | 安装 TypeScript 并创建 `tsconfig.json` |
| 找不到包 | 运行 `pnpm install` 并构建配置包 |

## 📦 依赖

### 非 Workspace
```json
{
  "devDependencies": {
    "eslint": "^9.37.0",
    "@antfu/eslint-config": "^6.0.0"
  }
}
```

### Workspace
```json
// 配置包
{
  "dependencies": {
    "@antfu/eslint-config": "^6.0.0"
  },
  "devDependencies": {
    "eslint": "^9.37.0",
    "tsdown": "^0.15.9"
  }
}
```

## 🔍 测试配置

```bash
# 查看配置
npx eslint --print-config index.js

# 检查文件
npx eslint src/index.ts

# 自动修复
npx eslint . --fix
```

---

**完整指南**: `frontend/templates/ESLINT-GUIDE.md`
**脚本位置**: `frontend/templates/scripts/setup-eslint.js`