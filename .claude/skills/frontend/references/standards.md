# 前端开发规范文档

> **版本**: 1.0
> **状态**: 已批准
> **创建日期**: 2026-01-12
> **适用范围**: 所有前端项目

---

## 📋 目录

- [命名规范](#命名规范)
- [代码风格](#代码风格)
- [特色实践](#特色实践)
- [CSS 系统](#css-系统)
- [项目结构](#项目结构)
- [Git 提交规范](#git-提交规范)
- [代码审查清单](#代码审查清单)
- [提交工具配置](#提交工具配置)
- [最佳实践](#最佳实践)
- [工具和依赖](#工具和依赖)

---

## 命名规范

### 1. 文件和目录命名

| 类型 | 命名规范 | 示例 | 说明 |
|------|----------|------|------|
| **组件** | PascalCase | `ArticleCard.tsx`, `UserProfile.tsx` | 所有组件文件使用大驼峰 |
| **Hooks** | camelCase + use 前缀 | `useModal.ts`, `useAuth.ts` | 自定义 Hook 必须以 use 开头 |
| **页面文件** | camelCase | `homePage.tsx`, `userSettings.tsx` | 页面级组件使用小驼峰 |
| **工具函数** | camelCase | `formatDate.ts`, `validateEmail.ts` | 工具文件使用小驼峰 |
| **常量文件** | camelCase 或 kebab-case | `constants.ts`, `app-config.ts` | 根据项目习惯选择 |
| **类型定义** | PascalCase | `types.ts`, `user-types.ts` | 类型文件使用大驼峰 |
| **路由文件** | kebab-case | `user-profile.tsx`, `admin-dashboard.tsx` | 路由文件使用短横线 |
| **Index 文件** | lowercase | `index.ts`, `index.tsx` | 例外：index 文件全小写 |

### 2. 代码标识符命名

| 类型 | 命名规范 | 示例 | 说明 |
|------|----------|------|------|
| **变量** | camelCase | `userName`, `isActive`, `itemList` | 普通变量使用小驼峰 |
| **常量** | UPPER_SNAKE_CASE | `MAX_SIZE`, `API_URL`, `DEFAULT_TIMEOUT` | 全大写下划线分隔 |
| **函数** | camelCase | `getUserData()`, `formatDate()` | 函数使用小驼峰 |
| **类** | PascalCase | `UserService`, `HttpClient` | 类名使用大驼峰 |
| **枚举** | PascalCase | `UserRole`, `StatusType` | 枚举类型使用大驼峰 |
| **枚举值** | UPPER_SNAKE_CASE | `ADMIN`, `PENDING` | 枚举值全大写 |

### 3. 命名示例对比

```typescript
// ❌ 错误示例
const user_name = "John";  // 变量不应使用下划线
const max_size = 100;      // 常量应大写
function GetUser() {}      // 函数不应大写
class user_service {}      // 类名应大写

// ✅ 正确示例
const userName = "John";
const MAX_SIZE = 100;
function getUser() {}
class UserService {}
```

---

## 代码风格

### 1. ESLint 配置

**主要使用 `@antfu/eslint-config`**

```bash
# 安装依赖
npm install -D eslint @antfu/eslint-config
```

**eslint.config.js** (推荐使用 Flat Config)
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

### 2. 代码格式化规则

| 规则 | 配置 | 说明 |
|------|------|------|
| **缩进** | 2 空格 | 统一使用 2 个空格，不使用 Tab |
| **引号** | 单引号 | JavaScript/TypeScript 代码使用单引号 |
| **分号** | 禁用 | 不使用分号（ESLint 处理） |
| **尾随逗号** | 启用 | 多行对象/数组的末尾保留逗号 |
| **行宽** | 100 字符 | 超过则换行 |
| **单引号** | JSX 中使用 | JSX 属性可以使用双引号 |

### 3. Workspace 项目配置

**Monorepo/Workspace 项目** 需要在 `packages` 中添加公共配置包，统一管理 ESLint 配置。

#### 项目结构
```
workspace/
├── packages/
│   ├── eslint-config/          # 公共 ESLint 配置包
│   │   ├── package.json
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── eslint.config.js
│   │   └── tsdown.config.ts
│   ├── app1/                   # 应用 1
│   └── app2/                   # 应用 2
├── package.json
└── pnpm-workspace.yaml
```

#### 配置包内容

**package.json**
```json
{
  "name": "@your-scope/eslint-config",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/es/index.mjs",
  "exports": {
    ".": "./dist/cjs/index.cjs",
    "./es": "./dist/es/index.mjs",
    "./cjs": "./dist/cjs/index.cjs"
  },
  "scripts": {
    "build": "tsdown"
  },
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

**src/index.ts**
```typescript
import antfu from '@antfu/eslint-config'

type Options = Parameters<typeof antfu>[0]

export default (options: Options = {}) => {
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    endOfLine: 'lf',
    trailingComma: 'all',
    semi: true,
  } as any

  if (typeof options.stylistic === 'object') {
    Object.assign(stylisticConfig, options.stylistic)
    delete options.stylistic
  }

  return antfu({
    formatters: true,
    stylistic: stylisticConfig,
    ...options,
  })
}
```

**eslint.config.js**
```javascript
import config from './src/index.js'

export default config
```

**tsdown.config.ts**
```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
})
```

#### 使用方式

在子项目中安装并使用：

```bash
# 在子项目中安装
pnpm add -D @your-scope/eslint-config

# 构建配置包（在配置包目录）
pnpm build
```

**eslint.config.js** (子项目)
```javascript
import config from '@your-scope/eslint-config'

export default config({
  // 子项目特定配置
  typescript: true,
  react: true,
  rules: {
    // 自定义规则
  }
})
```

**优势**
- ✅ 统一的代码风格配置
- ✅ 易于维护和更新
- ✅ 支持子项目特定配置
- ✅ 版本控制和升级便利

**快速开始**
```bash
# 1. 复制模板
cp -r frontend/templates/eslint-config packages/eslint-config

# 2. 修改包名
# 编辑 packages/eslint-config/package.json，修改 "name" 为 "@your-scope/eslint-config"

# 3. 安装依赖并构建
cd packages/eslint-config
pnpm install
pnpm build

# 4. 在子项目中使用
cd ../app1
pnpm add -D @your-scope/eslint-config
```

**示例代码风格**
```typescript
// ✅ 正确的代码风格
import { useState } from 'react'
import type { User } from './types'

const user: User = {
  name: 'John',
  email: 'john@example.com',
  age: 30,
}

function getUserData(userId: string) {
  const [data, setData] = useState(null)

  if (!userId) {
    return null
  }

  return (
    <div className="user-card">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### 3. TypeScript 配置

**包库项目** (packages) - 严格模式
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**应用项目** (apps) - 半严格模式
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": false,  // 允许隐式 any
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true
  }
}
```

---

## 特色实践

### 1. 中英双语代码

**原则：注释用中文，代码用英文**

```typescript
// ✅ 正确示例

// 用户服务类，负责用户相关的业务逻辑
class UserService {
  /**
   * 创建用户
   * @param userData - 用户数据
   * @returns 新创建的用户
   */
  async createUser(userData: UserData): Promise<User> {
    // 验证用户数据
    const validatedData = this.validateUserData(userData)

    // 检查邮箱是否已存在
    const existingUser = await this.findByEmail(validatedData.email)
    if (existingUser) {
      throw new Error('邮箱已存在')
    }

    // 创建用户
    return await this.userRepository.save(validatedData)
  }

  // 生成欢迎邮件内容
  private generateWelcomeEmail(email: string): EmailContent {
    return {
      to: email,
      subject: '欢迎注册',
      body: `欢迎 ${email}，您的账户已成功创建！`
    }
  }
}
```

### 2. Enum 库使用

**使用 `@jsonlee_12138/enum` 统一管理枚举**

```typescript
// ✅ 推荐做法

// 1. 安装 enum 库
// npm install @jsonlee_12138/enum

// 2. 导入并使用
import { UserRole, OrderStatus } from '@jsonlee_12138/enum'

// 3. 在代码中使用
function getUserRoleName(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return '管理员'
    case UserRole.USER:
      return '普通用户'
    case UserRole.VIP:
      return 'VIP 用户'
  }
}

// 4. 避免在项目中重复定义相同的枚举
```

**为什么使用统一的 Enum 库？**
- ✅ 避免重复定义
- ✅ 全项目统一
- ✅ 易于维护和更新
- ✅ 类型安全

### 3. CSS 变量主题系统

**使用 CSS 自定义属性实现主题切换**

```typescript
// theme.css
:root {
  /* 颜色系统 */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  /* 中性色 */
  --color-bg: #ffffff;
  --color-bg-secondary: #f3f4f6;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;

  /* 间距 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* 圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 暗色主题 */
[data-theme="dark"] {
  --color-bg: #111827;
  --color-bg-secondary: #1f2937;
  --color-text: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;
}

/* 使用示例 */
.button-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}
```

### 4. 自定义图标系统

**SVG 图标 + UnoCSS 集成**

```typescript
// 1. 图标组件 (components/icons/BaseIcon.tsx)
import React from 'react'

interface IconProps {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}

export const BaseIcon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = '',
  strokeWidth = 2
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 动态加载 SVG 路径 */}
      <use href={`/icons/${name}.svg#icon`} />
    </svg>
  )
}

// 2. 具体图标组件 (components/icons/UserIcon.tsx)
export const UserIcon: React.FC<Omit<IconProps, 'name'>> = (props) => {
  return <BaseIcon {...props} name="user" />
}

// 3. 在组件中使用
import { UserIcon } from '@/components/icons/UserIcon'

function UserProfile() {
  return (
    <div className="flex items-center gap-2">
      <UserIcon className="text-blue-500" />
      <span>用户中心</span>
    </div>
  )
}

// 4. UnoCSS 配置中使用图标
// uno.config.ts
import { defineConfig } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'
import { presetAliasColors } from '@jsonlee_12138/preset-alias-colors'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAliasColors({
      // 自定义颜色别名
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    })
  ]
})
```

---

## CSS 系统

### 1. UnoCSS 配置

**主要使用 UnoCSS，配合 presetWind4 和 presetAliasColors**

```typescript
// uno.config.ts
import { defineConfig } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'
import { presetAliasColors } from '@jsonlee_12138/preset-alias-colors'

export default defineConfig({
  presets: [
    // Wind4 预设（类似 Tailwind CSS）
    presetWind4(),

    // 自定义颜色别名预设
    presetAliasColors({
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
    }),
  ],

  // 自定义规则
  rules: [
    // 例如：自定义文本截断
    ['text-ellipsis', { 'text-overflow': 'ellipsis', 'overflow': 'hidden', 'white-space': 'nowrap' }],
  ],

  // 快捷方式
  shortcuts: {
    'btn-primary': 'bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md transition',
    'card': 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-4',
    'flex-center': 'flex items-center justify-center',
  },
})
```

### 2. UnoCSS 使用示例

```tsx
// ✅ 推荐使用 UnoCSS 类名

function Button({ children, variant = 'primary' }) {
  return (
    <button className={`
      px-4 py-2 rounded-md font-medium transition
      ${variant === 'primary' ? 'bg-primary text-white hover:bg-primary-hover' : ''}
      ${variant === 'secondary' ? 'bg-secondary text-white hover:bg-secondary-hover' : ''}
      ${variant === 'danger' ? 'bg-danger text-white hover:bg-danger-hover' : ''}
    `}>
      {children}
    </button>
  )
}

// 使用快捷方式
function Card({ children }) {
  return <div className="card">{children}</div>
}

// 组合使用
function UserProfile() {
  return (
    <div className="flex-center flex-col gap-4 p-6">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex-center">
        <UserIcon size={32} className="text-primary" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          用户名称
        </h3>
        <p className="text-sm text-gray-500">user@example.com</p>
      </div>
    </div>
  )
}
```

### 3. 颜色系统

**使用 presetAliasColors 提供的颜色别名**

```typescript
// 颜色别名映射
{
  primary: '#3b82f6',    // 主色调
  secondary: '#8b5cf6',  // 次要色调
  success: '#10b981',    // 成功
  warning: '#f59e0b',    // 警告
  danger: '#ef4444',     // 危险
  info: '#06b6d4',       // 信息
}

// 使用示例
<div className="
  bg-primary text-white
  hover:bg-primary-hover
  border border-primary/20
  bg-primary/10
  text-primary
  ring-primary
">
  内容
</div>
```

---

## 项目结构

### 推荐目录结构

```
src/
├── app/                    # 页面和路由 (Next.js App Router)
│   ├── (main)/            # 主布局
│   ├── (auth)/            # 认证布局
│   ├── page.tsx           # 首页
│   └── layout.tsx         # 根布局
│
├── components/            # 通用组件
│   ├── ui/               # 基础 UI 组件 (Button, Input, Card)
│   ├── layout/           # 布局组件 (Header, Sidebar)
│   ├── icons/            # 图标组件
│   └── shared/           # 共享业务组件
│
├── hooks/                 # 自定义 Hooks
│   ├── useAuth.ts
│   ├── useModal.ts
│   └── useApi.ts
│
├── lib/                   # 工具库和配置
│   ├── utils.ts          # 通用工具函数
│   ├── api.ts            # API 客户端
│   └── constants.ts      # 常量定义
│
├── types/                 # TypeScript 类型定义
│   ├── user.ts
│   ├── api.ts
│   └── index.ts
│
├── stores/                # 状态管理 (Zustand/Redux)
│   ├── useUserStore.ts
│   └── useAppStore.ts
│
├── styles/                # 样式文件
│   ├── globals.css       # 全局样式
│   └── theme.css         # 主题变量
│
└── assets/                # 静态资源
    ├── images/
    └── fonts/
```

### 命名示例

```typescript
// ✅ 正确的文件命名
src/
  components/
    ArticleCard.tsx          // 组件：PascalCase
    UserProfile.tsx          // 组件：PascalCase
    icons/
      UserIcon.tsx           // 图标组件：PascalCase
      HomeIcon.tsx
  hooks/
    useModal.ts              // Hook：camelCase + use 前缀
    useAuth.ts
  lib/
    formatDate.ts            // 工具：camelCase
    validateEmail.ts
  app/
    homePage.tsx             // 页面：camelCase
    userSettings.tsx
    (main)/
      layout.tsx             // 布局：lowercase
```

---

## Git 提交规范

### 提交消息格式

采用 Conventional Commits 规范：

```
<type>[optional scope]: <description>

[optional body]
[optional footer]
```

**格式说明**
```bash
type(scope): subject
```

- **type** (必填): 提交类型，小写英文
- **scope** (可选): 提交范围，描述修改的影响范围
- **subject** (必填): 简短描述，使用现在时态，不以句号结尾

**规则要求**
1. type 必须是小写英文
2. subject 使用现在时态，不以句号结尾
3. subject 首字母不大写（除非专有名词）
4. 可使用中文或英文，建议保持一致性

### 提交类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| **feat** | 新增功能 | 添加新特性、新 API |
| **fix** | 修复缺陷 | 修复 bug、错误处理 |
| **docs** | 文档更新 | 修改文档、README |
| **style** | 代码格式 | 代码格式化、风格调整 |
| **refactor** | 代码重构 | 重构代码，不改变功能 |
| **perf** | 性能提升 | 性能优化 |
| **test** | 测试相关 | 添加/修改测试 |
| **build** | 构建相关 | 修改构建配置、依赖 |
| **ci** | 持续集成 | CI/CD 配置 |
| **revert** | 回退代码 | 回退之前的提交 |
| **chore** | 其他修改 | 杂项修改 |

### 提交范围 (Scope)

Scope 用于指定修改的具体模块或功能范围。

**常用 Scope**
- `core` - 核心功能
- `components` - 组件
- `hooks` - Hooks
- `utils` - 工具函数
- `types` - 类型定义
- `docs` - 文档
- `test` - 测试
- `build` - 构建配置
- `ci` - CI/CD

### 提交示例

```bash
# 简短提交
feat: add user profile page
fix: resolve form validation issue
docs: update API documentation

# 带范围的提交
feat(components): add ArticleCard component
fix(hooks): resolve useModal memory leak
docs(utils): update formatDate usage

# 带正文的提交
fix: handle network errors in streaming mode

Previously, network errors during streaming responses were not
properly handled, causing the application to hang. This fix
adds proper error handling and cleanup for streaming requests.

Fixes #123

# 带破坏性变更的提交
feat!: change default timeout to 5000ms

BREAKING CHANGE: The default timeout has been changed from
3000ms to 5000ms. Please update your configuration if needed.

# 带问题关联的提交
fix: resolve memory leak in request queue

- Fix memory leak when requests are cancelled
- Improve cleanup logic for pending requests

Closes #45
Fixes #67
```

---

## 提交工具配置

### 安装依赖

```bash
# 使用 pnpm 安装提交规范工具
pnpm add -D @commitlint/cli @commitlint/config-conventional cz-git husky lint-staged

# 初始化 husky
npx husky init

# 添加 commitlint 配置
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

### 配置文件

#### 1. Commitlint 配置 (.commitlintrc.cjs)

```javascript
// .commitlintrc.cjs
/** @type {import('cz-git').UserConfig} */
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
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: "选择你要提交的类型 | Select the type of change that you're committing:",
      scope: '选择一个提交范围（可选）| Denote the SCOPE of this change (optional):',
      customScope: '请输入自定义的提交范围 | Denote the SCOPE of this change:',
      subject: '填写简短精炼的变更描述 | Write a SHORT, IMPERATIVE tense description of the change:\\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 | Provide a LONGER description of the change (optional). Use "|" to break new line:\\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 | List any BREAKING CHANGES (optional). Use "|" to break new line:\\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）| Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: '输入自定义issue前缀 | Input ISSUES prefix:',
      footer: '列举关联issue (可选) 例如: #31, #I3244 | List any ISSUES by this change. E.g.: #31, #34:\\n',
      confirmCommit: '是否提交或修改commit ? | Are you sure you want to proceed with the commit above?'
    },
    types: [
      { value: 'feat', name: 'feat:     新增功能 | A new feature' },
      { value: 'fix', name: 'fix:      修复缺陷 | A bug fix' },
      { value: 'docs', name: 'docs:     文档更新 | Documentation only changes' },
      { value: 'style', name: 'style:    代码格式 | Changes that do not affect the meaning of the code' },
      { value: 'refactor', name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature' },
      { value: 'perf', name: 'perf:     性能提升 | A code change that improves performance' },
      { value: 'test', name: 'test:     测试相关 | Adding missing tests or correcting existing tests' },
      { value: 'build', name: 'build:    构建相关 | Changes that affect the build system or external dependencies' },
      { value: 'ci', name: 'ci:       持续集成 | Changes to our CI configuration files and scripts' },
      { value: 'revert', name: 'revert:   回退代码 | Revert to a commit' },
      { value: 'chore', name: 'chore:    其他修改 | Other changes that do not modify src or test files' }
    ],
    useEmoji: false,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' }
    ],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: ''
  }
}
```

#### 2. Lint-staged 配置 (.lintstagedrc)

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

**说明**:
- 使用 `pnpm lint` 而不是固定工具，允许项目自定义格式化方案
- 可以配置为使用 ESLint、Prettier、Oxlint 或其他工具
- 支持多种文件类型的格式化

#### 3. Git Hooks (.husky/pre-commit)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
```

#### 4. package.json 配置

```json
{
  "scripts": {
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

**自定义 Lint 配置示例**

如果项目使用不同的格式化工具，可以这样配置：

```json
// 使用 Oxlint
{
  "scripts": {
    "lint": "oxlint --fix",
    "lint:style": "prettier --write ."
  }
}

// 使用 Prettier + ESLint
{
  "scripts": {
    "lint": "eslint --fix . && prettier --write .",
    "lint:style": "prettier --write ."
  }
}

// 使用 Biome
{
  "scripts": {
    "lint": "biome check --fix .",
    "lint:style": "biome format --write ."
  }
}
```

### 使用方式

#### 方式 1：交互式提交（推荐）

```bash
pnpm cz
```

系统会依次询问：
1. 选择提交类型 (feat/fix/docs 等)
2. 输入提交范围 (可选)
3. 填写简短描述
4. 填写详细描述 (可选)
5. 关联 Issue (可选)
6. 确认提交

#### 方式 2：手动提交

```bash
git add .
git commit -m "feat: add new feature"
```

提交时会自动验证格式，不符合规范将被拒绝。

### 自动化流程

当执行 `git commit` 时，会触发以下流程：

1. **Git Hook 触发**: Husky 触发 `pre-commit` hook
2. **代码格式化**: 自动运行 `lint-staged`
   - 执行 `pnpm lint` 修复代码格式问题
3. **提交验证**: `commitlint` 验证提交信息格式
4. **验证结果**:
   - ✅ 通过：提交成功
   - ❌ 失败：提交被拒绝，需修正后重新提交

### 相关命令

```bash
# 交互式提交
pnpm cz

# 手动格式化代码
pnpm lint

# 检查提交信息格式
npx commitlint --from=HEAD~1 --to=HEAD --verbose
```

---

## 代码审查清单

### 提交前检查

#### ✅ 命名规范
- [ ] 组件使用 PascalCase
- [ ] Hooks 使用 camelCase + use 前缀
- [ ] 变量使用 camelCase
- [ ] 常量使用 UPPER_SNAKE_CASE
- [ ] 文件命名符合规范

#### ✅ 代码质量
- [ ] TypeScript 类型完整
- [ ] 无 any 类型（或有合理理由）
- [ ] 函数参数有类型注解
- [ ] 返回值有类型注解
- [ ] 复杂函数有注释（中文）

#### ✅ 代码风格
- [ ] 使用 2 空格缩进
- [ ] 使用单引号
- [ ] 无分号
- [ ] 尾随逗号
- [ ] ESLint 无错误

#### ✅ 功能实现
- [ ] 功能完整实现
- [ ] 边界情况处理
- [ ] 错误处理完善
- [ ] 代码可读性好
- [ ] 无重复代码

#### ✅ 组件规范
- [ ] 组件职责单一
- [ ] Props 类型定义
- [ ] 使用 Hooks 管理状态
- [ ] 样式使用 UnoCSS
- [ ] 组件可复用

#### ✅ 样式规范
- [ ] 使用 UnoCSS 类名
- [ ] 使用 CSS 变量
- [ ] 响应式设计
- [ ] 暗色主题支持
- [ ] 无内联样式

#### ✅ 测试
- [ ] 单元测试通过
- [ ] 类型检查通过
- [ ] 构建成功

---

## 最佳实践

### 1. 组件开发

```typescript
// ✅ 好的组件示例
import React, { memo, useCallback } from 'react'
import type { FC } from 'react'

interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// 使用 memo 优化性能
export const UserCard: FC<UserCardProps> = memo(({ user, onEdit, onDelete }) => {
  // 使用 useCallback 优化事件处理
  const handleEdit = useCallback(() => {
    onEdit?.(user.id)
  }, [onEdit, user.id])

  const handleDelete = useCallback(() => {
    if (confirm('确定删除吗？')) {
      onDelete?.(user.id)
    }
  }, [onDelete, user.id])

  return (
    <div className="card hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="btn-primary"
          >
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-danger text-white rounded-md hover:bg-danger-hover"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
})

UserCard.displayName = 'UserCard'
```

### 2. Hook 开发

```typescript
// ✅ 好的 Hook 示例
import { useState, useCallback, useEffect } from 'react'

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

// Hook 命名：use + 功能
export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  // ESC 键关闭
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, close])

  return { isOpen, open, close, toggle }
}
```

### 3. API 调用

```typescript
// ✅ 好的 API 调用示例
import { useCallback, useState } from 'react'
import type { ApiResponse } from '@/types/api'

interface User {
  id: string
  name: string
  email: string
}

// 使用自定义 API 客户端
export function useUserApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取用户列表
  const getUsers = useCallback(async (): Promise<User[]> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users')
      const data: ApiResponse<User[]> = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '获取用户失败')
      }

      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // 创建用户
  const createUser = useCallback(async (userData: Partial<User>): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data: ApiResponse<User> = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '创建用户失败')
      }

      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { getUsers, createUser, loading, error }
}
```

---

## 工具和依赖

### 推荐依赖

#### 核心开发依赖

```json
{
  "devDependencies": {
    "@antfu/eslint-config": "^latest",
    "eslint": "^9.18.0",
    "typescript": "^5.7.3",
    "@types/node": "^22.10.6",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5"
  }
}
```

#### 样式和 CSS 工具

```json
{
  "devDependencies": {
    "unocss": "^0.65.4",
    "@unocss/preset-wind4": "^0.65.4",
    "@jsonlee_12138/preset-alias-colors": "latest"
  }
}
```

#### 提交规范工具

```json
{
  "devDependencies": {
    "@commitlint/cli": "^19.6.1",
    "@commitlint/config-conventional": "^19.6.0",
    "cz-git": "^1.11.0",
    "husky": "^9.1.7",
    "lint-staged": "^15.3.0"
  }
}
```

#### 运行时依赖

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### 完整 package.json 示例

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "type": "module",
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
  },
  "devDependencies": {
    "@antfu/eslint-config": "^latest",
    "eslint": "^9.18.0",
    "typescript": "^5.7.3",
    "@types/node": "^22.10.6",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "unocss": "^0.65.4",
    "@unocss/preset-wind4": "^0.65.4",
    "@jsonlee_12138/preset-alias-colors": "latest",
    "@commitlint/cli": "^19.6.1",
    "@commitlint/config-conventional": "^19.6.0",
    "cz-git": "^1.11.0",
    "husky": "^9.1.7",
    "lint-staged": "^15.3.0",
    "vite": "^6.0.7"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### VS Code 配置

```json
// .vscode/settings.json
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

### 推荐 VS Code 扩展

- **ESLint** - Microsoft (代码检查)
- **Prettier** - Prettier (代码格式化)
- **UnoCSS** - UnoCSS (Tailwind 类型的智能提示)
- **TypeScript Hero** - TypeScript 工具
- **GitLens** - Git 增强
- **Conventional Commits** - 提交规范提示

---

## 最佳实践

### 1. 提交规范最佳实践

#### ✅ 推荐做法
1. **原子提交**：每个提交只做一件事
2. **清晰描述**：使用简洁明了的描述
3. **使用范围**：当修改影响特定模块时使用 scope
4. **关联问题**：在正文中关联相关 issue
5. **英文提交**：建议使用英文，保持一致性

```bash
# ✅ 好的示例
feat: add request cancellation support
fix(core): resolve memory leak in interceptor chain
docs: update plugin development guide
```

#### ❌ 避免做法
1. **模糊描述**：避免 "update"、"fix" 等过于简单的描述
2. **过长描述**：subject 应该简洁，详细说明放正文
3. **缺少类型**：必须指定提交类型
4. **混合修改**：避免在一个提交中包含多个不相关的修改

```bash
# ❌ 不好的示例
update code
fix bug
feat: add feature A and fix bug B
```

### 2. 代码格式化最佳实践

**使用 `pnpm lint` 而非固定工具**

```json
// package.json - 灵活配置
{
  "scripts": {
    "lint": "eslint --fix .",           // 方案 1: ESLint
    "lint": "oxlint --fix",             // 方案 2: Oxlint
    "lint": "biome check --fix .",      // 方案 3: Biome
    "lint": "eslint --fix . && prettier --write ."  // 方案 4: 组合
  }
}
```

**优势**：
- ✅ 项目可自由选择格式化工具
- ✅ 团队可统一标准
- ✅ 易于迁移和升级
- ✅ lint-staged 自动调用

### 3. 组件开发最佳实践

```typescript
// ✅ 推荐：使用 memo 和 useCallback
import { memo, useCallback } from 'react'

interface Props {
  data: DataType
  onUpdate: (id: string, data: Partial<DataType>) => void
}

export const DataCard = memo(({ data, onUpdate }: Props) => {
  const handleUpdate = useCallback(() => {
    onUpdate(data.id, { status: 'active' })
  }, [data.id, onUpdate])

  return (
    <div className="card">
      <h3>{data.name}</h3>
      <button onClick={handleUpdate} className="btn-primary">
        更新
      </button>
    </div>
  )
})

DataCard.displayName = 'DataCard'
```

### 4. CSS/样式最佳实践

```typescript
// ✅ 推荐：使用 UnoCSS + CSS 变量
// uno.config.ts
export default defineConfig({
  presets: [
    presetWind4(),
    presetAliasColors({
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    })
  ],
  shortcuts: {
    'btn-primary': 'bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md transition',
    'card': 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-4',
  }
})

// 组件中使用
function Button({ children }) {
  return <button className="btn-primary">{children}</button>
}
```

### 5. 提交流程最佳实践

```bash
# 完整工作流程
1. 开发功能
   git checkout -b feat/user-auth

2. 编写代码
   # 修改文件...

3. 格式化代码
   pnpm lint

4. 添加到暂存区
   git add .

5. 交互式提交
   pnpm cz
   # 选择类型、填写描述

6. 推送代码
   git push origin feat/user-auth
```

---

## 快速参考

### 命名速查表

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `ArticleCard.tsx` |
| Hooks | camelCase + use | `useModal.ts` |
| 变量 | camelCase | `userName` |
| 常量 | UPPER_SNAKE_CASE | `MAX_SIZE` |
| 文件 | 视类型而定 | 见上文 |

### 提交类型速查表

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档 |
| `style` | 代码格式 |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `build` | 构建配置 |
| `ci` | CI/CD |
| `revert` | 回退 |
| `chore` | 其他 |

### 常用命令速查

```bash
# 提交
pnpm cz                    # 交互式提交
git commit -m "feat: ..."  # 手动提交

# 格式化
pnpm lint                 # 格式化代码
pnpm lint:style           # 格式化样式

# 检查
npx commitlint --from=HEAD~1 --to=HEAD --verbose
```

---

## 总结

### 核心原则

1. **命名一致** - 严格遵循命名规范，保持代码可读性
2. **代码简洁** - 使用 `pnpm lint` 自动格式化，工具可自定义
3. **类型安全** - 充分利用 TypeScript 类型系统
4. **中英双语** - 注释中文，代码英文
5. **统一工具** - 使用团队统一的工具库和配置
6. **CSS 现代化** - UnoCSS + presetWind4 + presetAliasColors
7. **图标系统** - SVG + 自定义图标组件
8. **提交规范** - Conventional Commits + 交互式提交

### 提交前检查清单

- ✅ 命名是否符合规范？
- ✅ 类型是否完整？
- ✅ 注释是否清晰（中文）？
- ✅ 样式是否使用 UnoCSS？
- ✅ 代码是否可读？
- ✅ 无重复代码？
- ✅ 已运行 `pnpm lint`？

---

**文档版本**: v1.0
**最后更新**: 2026-01-12
**维护者**: 前端团队
**审查周期**: 每季度
**状态**: ✅ 已批准
