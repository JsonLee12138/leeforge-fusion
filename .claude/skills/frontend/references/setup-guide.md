# 前端规范快速设置指南

> 5 分钟快速配置完整的前端开发规范

---

## 📋 目录

- [1. 安装依赖](#1-安装依赖)
- [2. 配置文件](#2-配置文件)
- [3. Git Hooks](#3-git-hooks)
- [4. package.json](#4-packagejson)
- [5. 验证配置](#5-验证配置)
- [6. 使用示例](#6-使用示例)
- [7. Workspace 项目配置](#7-workspace-项目配置)

---

## 1. 安装依赖

```bash
# 进入项目根目录
cd your-project

# 安装 ESLint 和代码规范
pnpm add -D @antfu/eslint-config eslint

# 安装 UnoCSS 和相关预设
pnpm add -D unocss @unocss/preset-wind4
pnpm add -D @jsonlee_12138/preset-alias-colors

# 安装 TypeScript 和类型
pnpm add -D typescript @types/node @types/react @types/react-dom

# 安装提交规范工具
pnpm add -D @commitlint/cli @commitlint/config-conventional cz-git husky lint-staged

# 安装运行时依赖
pnpm add react react-dom
```

---

## 2. 配置文件

### 2.1 ESLint 配置

创建 `eslint.config.js`：

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  // TypeScript 项目
  typescript: true,

  // React 项目
  react: true,

  // 自定义规则
  rules: {
    // 你的自定义规则
  }
})
```

### 2.2 UnoCSS 配置

创建 `uno.config.ts`：

```typescript
import { defineConfig } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'
import { presetAliasColors } from '@jsonlee_12138/preset-alias-colors'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAliasColors({
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
    }),
  ],
  shortcuts: {
    'btn-primary': 'bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md transition',
    'card': 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-4',
    'flex-center': 'flex items-center justify-center',
  },
})
```

### 2.3 TypeScript 配置

创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "noImplicitAny": false,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.4 Commitlint 配置

复制模板文件：

```bash
# 复制提交规范模板
cp docs/templates/commitlintrc.template.cjs .commitlintrc.cjs
```

或者手动创建 `.commitlintrc.cjs`：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']
    ]
  },
  prompt: {
    // ... 完整配置见模板文件
  }
}
```

### 2.5 Lint-staged 配置

创建 `.lintstagedrc`：

```json
{
  "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}": [
    "pnpm lint",
    "git add"
  ],
  "**/*.{css,scss,less,html,md,json,yaml,yml}": [
    "pnpm lint:style",
    "git add"
  ]
}
```

---

## 3. Git Hooks

### 3.1 初始化 Husky

```bash
# 初始化 Husky
npx husky init

# 创建 pre-commit hook
echo "pnpm lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### 3.2 配置 commit-msg hook

```bash
# 创建 commit-msg hook
echo "npx commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

---

## 4. package.json

### 4.1 添加 scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",

    "cz": "cz",
    "lint": "eslint --fix .",
    "lint:style": "prettier --write .",

    "prepare": "husky install"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

### 4.2 自定义 Lint 配置示例

根据项目需求选择：

```json
// 使用 Oxlint
{
  "scripts": {
    "lint": "oxlint --fix"
  }
}

// 使用 Biome
{
  "scripts": {
    "lint": "biome check --fix .",
    "lint:style": "biome format --write ."
  }
}

// 使用 ESLint + Prettier
{
  "scripts": {
    "lint": "eslint --fix . && prettier --write ."
  }
}
```

---

## 5. 验证配置

### 5.1 初始化 Husky

```bash
# 安装后自动运行
pnpm prepare
```

### 5.2 测试 ESLint

```bash
# 检查代码
pnpm lint

# 应该没有错误
```

### 5.3 测试 UnoCSS

```bash
# 运行开发服务器
pnpm dev

# 检查 UnoCSS 是否正常工作
```

### 5.4 测试提交规范

```bash
# 测试提交
git add .
pnpm cz

# 选择类型、填写描述
# 应该成功提交
```

---

## 6. 使用示例

### 6.1 开发新功能

```bash
# 1. 创建分支
git checkout -b feat/user-auth

# 2. 编写代码
# 编辑 src/components/AuthForm.tsx

# 3. 格式化代码
pnpm lint

# 4. 提交代码
git add .
pnpm cz
# 选择: feat
# Scope: components
# 描述: add user authentication form

# 5. 推送
git push origin feat/user-auth
```

### 6.2 组件示例

```typescript
// src/components/UserCard.tsx
import { memo, useCallback } from 'react'
import type { FC } from 'react'

interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
  }
  onEdit?: (id: string) => void
}

export const UserCard: FC<UserCardProps> = memo(({ user, onEdit }) => {
  const handleEdit = useCallback(() => {
    onEdit?.(user.id)
  }, [onEdit, user.id])

  return (
    <div className="card hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button onClick={handleEdit} className="btn-primary">
          编辑
        </button>
      </div>
    </div>
  )
})

UserCard.displayName = 'UserCard'
```

### 6.3 页面示例

```typescript
// src/app/userPage.tsx
import { useState } from 'react'
import { UserCard } from '@/components/UserCard'
import { useUserApi } from '@/hooks/useUserApi'

export default function UserPage() {
  const [users, setUsers] = useState([])
  const { getUsers, loading } = useUserApi()

  // 获取用户列表
  const fetchUsers = async () => {
    const data = await getUsers()
    setUsers(data)
  }

  return (
    <div className="p-6">
      <div className="flex-center flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          用户管理
        </h1>
        <button onClick={fetchUsers} className="btn-primary">
          {loading ? '加载中...' : '刷新'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
```

---

## 7. VS Code 配置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

### 推荐扩展

- **ESLint** - Microsoft
- **UnoCSS** - UnoCSS
- **TypeScript Hero** - TypeScript 工具
- **GitLens** - Git 增强
- **Conventional Commits** - 提交规范提示

---

## 8. Workspace 项目配置

如果你的项目是 **Monorepo/Workspace** 结构，需要在 `packages` 中创建共享的 ESLint 配置包。

### 8.1 创建配置包

```bash
# 在 workspace 根目录
cp -r frontend/templates/eslint-config packages/eslint-config

# 修改包名
# 编辑 packages/eslint-config/package.json
# 修改 "name" 为 "@your-scope/eslint-config"
```

### 8.2 构建配置包

```bash
cd packages/eslint-config
pnpm install
pnpm build
```

### 8.3 在子项目中使用

```bash
# 在子项目中安装
cd ../app1
pnpm add -D @your-scope/eslint-config

# 创建 eslint.config.js
cat > eslint.config.js << 'EOF'
import config from '@your-scope/eslint-config'

export default config({
  typescript: true,
  react: true,
  rules: {
    // 自定义规则
  }
})
EOF
```

### 8.4 配置 package.json

```json
{
  "scripts": {
    "lint": "eslint --fix .",
    "lint:check": "eslint ."
  }
}
```

**详细说明**: 查看 [standards.md → Workspace 项目配置](./standards.md#3-workspace-项目配置)

---

## 9. 常见问题

### Q: 为什么使用 `pnpm lint` 而不是固定工具？

**A**: 灵活性！项目可以自由选择：
- ESLint
- Oxlint
- Biome
- Prettier
- 或组合使用

### Q: 如何修改颜色系统？

**A**: 在 `uno.config.ts` 中修改 `presetAliasColors` 的配置。

### Q: 如何添加自定义提交类型？

**A**: 在 `.commitlintrc.cjs` 的 `rules['type-enum']` 和 `prompt.types` 中添加。

### Q: 提交时格式化失败怎么办？

**A**:
1. 手动运行 `pnpm lint` 修复
2. 检查 `package.json` 中的 lint 配置
3. 确认所有依赖已安装

---

## 10. 下一步

✅ 配置完成！现在你可以：

1. **开始开发** - 使用规范编写代码
2. **提交代码** - 使用 `pnpm cz` 交互式提交
3. **查阅文档** - 查看 [standards.md](./standards.md)
4. **自定义配置** - 根据项目需求调整
5. **Workspace 项目** - 按第 8 章配置共享配置包

---

**文档版本**: v1.0
**最后更新**: 2026-01-12
