---
name: frontend-standard
description: Provides frontend development standards, naming conventions, code style guidelines, and best practices for modern web development with React/TypeScript
---

# Frontend Standards Skill

## 🎯 When to Use

Use this skill when you need help with:
- Creating new frontend projects
- Code review and standards compliance
- Writing compliant components
- Configuring development tools
- Git commit standards
- Team training and onboarding
- Workspace/Monorepo setup
- Shared ESLint configuration

## 📋 Core Standards

### 1. Naming Conventions

**Components**: PascalCase
```typescript
// ✅ ArticleCard.tsx, UserProfile.tsx
// ❌ articleCard.tsx, user_profile.tsx
```

**Hooks**: camelCase + use prefix
```typescript
// ✅ useModal.ts, useAuth.ts
// ❌ modalHook.ts, use_user.ts
```

**Variables**: camelCase
```typescript
// ✅ userName, isActive, itemList
// ❌ user_name, is_active, item_list
```

**Constants**: UPPER_SNAKE_CASE
```typescript
// ✅ MAX_SIZE, API_URL, DEFAULT_TIMEOUT
// ❌ maxSize, apiUrl, defaultTimeout
```

### 2. Code Style

**ESLint**: Use `@antfu/eslint-config`
```javascript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  react: true,
})
```

**Workspace Projects**:
```bash
# Create shared config package
cp -r frontend/assets/eslint-config packages/eslint-config

# Build after modifying package name
cd packages/eslint-config
pnpm install && pnpm build

# Use in subprojects
pnpm add -D @your-scope/eslint-config
```

**Formatting Rules**:
- Indent: 2 spaces
- Quotes: Single quotes
- Semicolons: None
- Trailing commas: Enabled
- Line width: 100 characters

### 3. Bilingual Code Practice

**Chinese comments, English code**:
```typescript
// ✅ Comments in Chinese, code in English
// 用户服务类，负责用户相关的业务逻辑
class UserService {
  async createUser(userData: UserData): Promise<User> {
    // 验证用户数据
    const validatedData = this.validateUserData(userData)
    return await this.userRepository.save(validatedData)
  }
}
```

**Enum Library**:
```typescript
// Using @jsonlee_12138/enum
import { UserRole } from '@jsonlee_12138/enum'

function getRoleName(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN: return '管理员'
    case UserRole.USER: return '普通用户'
  }
}
```

**CSS System**:
```typescript
// uno.config.ts
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
    })
  ],
  shortcuts: {
    'btn-primary': 'bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md transition',
    'card': 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-4',
  }
})
```

### 4. Git Commit Standards

**Format**:
```
type(scope): subject

[body]
[footer]
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation update
- `style` - Code formatting
- `refactor` - Refactoring
- `perf` - Performance optimization
- `test` - Test related
- `build` - Build configuration
- `ci` - Continuous integration
- `revert` - Code rollback
- `chore` - Other changes

**Examples**:
```bash
# Interactive commit
pnpm cz

# Manual commit
git commit -m "feat(components): add ArticleCard component"

# With body
git commit -m "fix(hooks): resolve useModal memory leak

- Fix memory leak when requests are cancelled
- Improve cleanup logic for pending requests

Closes #45"
```

### 5. Tool Configuration

**Installation**:
```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional cz-git husky lint-staged
```

**package.json scripts**:
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

**Lint-staged**:
```json
{
  "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}": ["pnpm lint", "git add"],
  "**/*.{css,scss,less,html,md,json,yaml,yml}": ["pnpm lint:style", "git add"]
}
```

### 6. Component Development Best Practice

```typescript
// ✅ Recommended component structure
import { memo, useCallback } from 'react'
import type { FC } from 'react'

interface UserCardProps {
  user: { id: string; name: string; email: string }
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

### 7. Pre-Commit Checklist

- [ ] Naming follows conventions
- [ ] TypeScript types complete
- [ ] Comments clear (Chinese)
- [ ] Styles use UnoCSS
- [ ] Code readable
- [ ] No duplicate code
- [ ] Run `pnpm lint`

## 🚀 Quick Commands

```bash
# Interactive commit
pnpm cz

# Format code
pnpm lint

# Format styles
pnpm lint:style

# Check commit format
npx commitlint --from=HEAD~1 --to=HEAD --verbose
```

## 📚 Resources

### Reference Documents
- **Complete Standards**: `frontend/references/standards.md`
- **Setup Guide**: `frontend/references/setup-guide.md`

### Templates
- **Commitlint Config**: `frontend/assets/commitlintrc.template.cjs`
- **ESLint Workspace**: `frontend/assets/eslint-config/`

## 🎯 Best Practices

1. **Always use interactive commit** - `pnpm cz` guides you to create规范的提交
2. **Run lint before commit** - Ensure code format is correct
3. **Use shortcuts** - UnoCSS shortcuts improve development efficiency
4. **Keep comments Chinese** - Code in English, comments in Chinese
5. **Follow atomic commits** - Each commit does one thing
6. **Workspace projects** - Use shared config packages for unified style

## 📝 Version Info

**Version**: 1.0.0
**Last Updated**: 2026-01-13
**Maintainer**: Frontend Team