# Frontend Skill Rules

## 📋 File Naming Standards

### General Rules
- **ALWAYS use English** for all file and directory names
- **NEVER use Chinese characters** in file names
- **Use kebab-case** for multi-word names: `user-profile.tsx`, `article-card.tsx`
- **Keep names lowercase** (except for component files)

### Component Files
- **PascalCase** for component files: `ArticleCard.tsx`, `UserProfile.tsx`
- **camelCase** for hooks: `useModal.ts`, `useAuth.ts`
- **camelCase** for utility files: `formatDate.ts`, `apiClient.ts`

### Configuration Files
- **kebab-case**: `eslint.config.js`, `commitlintrc.cjs`
- **snake_case** when required: `ecosystem.config.js`

### Directory Names
- **kebab-case**: `components/`, `hooks/`, `utils/`, `services/`
- **lowercase**: `src/`, `public/`, `dist/`

## 🎯 Skill Usage Rules

### When to Use This Skill

**Use @frontend-standard when:**
- Creating new frontend components
- Setting up development environment
- Code review and standards compliance
- Git commit message formatting
- Configuring ESLint/Prettier/TypeScript
- Workspace/Monorepo setup
- Team onboarding and training

**Trigger phrases:**
- "Create a [component] component"
- "Review this frontend code"
- "Setup frontend project"
- "Configure ESLint for workspace"
- "How do I name this hook?"
- "Check if this follows standards"

### Required Workflow

#### 1. Project Setup
```bash
# Always use the skill for initial setup
@frontend-standard I'm starting a new React project

# Follow the setup guide
cat frontend/references/setup-guide.md
```

#### 2. Component Development
```bash
# Ask skill to create components
@frontend-standard Create a UserCard component with props

# Review your code
@frontend-standard Review this component for compliance
```

#### 3. Code Review
```bash
# Before committing
@frontend-standard Check this code:
- Naming conventions
- TypeScript types
- Code style
- Best practices
```

## 📝 Quality Standards

### Required Elements
- ✅ **YAML frontmatter** in SKILL.md
- ✅ **Imperative language** (verb-first instructions)
- ✅ **Clear usage scenarios**
- ✅ **Reference to resources** (if any)
- ✅ **English file names** only

### Validation Checklist
Before using the skill, verify:
- [ ] File names follow conventions
- [ ] Component files use PascalCase
- [ ] Hook files use camelCase with use prefix
- [ ] Directory names use kebab-case
- [ ] No spaces or special characters
- [ ] All names in English

## 🚫 Common Mistakes

### ❌ Don't Do This
```typescript
// Wrong file naming
articleCard.tsx          # Should be ArticleCard.tsx
use_modal.ts             # Should be useModal.ts
user_profile.tsx         # Should be UserProfile.tsx

// Wrong naming conventions
const user_name = "John" # Should be userName
const MAX_SIZE = 100     # Should be UPPER_SNAKE_CASE for constants
```

### ✅ Do This Instead
```typescript
// Correct file naming
ArticleCard.tsx          # PascalCase for components
useModal.ts              # camelCase + use prefix for hooks
UserProfile.tsx          # PascalCase for components

// Correct naming conventions
const userName = "John"  # camelCase for variables
const MAX_SIZE = 100     # UPPER_SNAKE_CASE for constants
```

## 📚 Resources

### Reference Documents
- **Complete Standards**: `frontend/references/standards.md`
- **Setup Guide**: `frontend/references/setup-guide.md`

### Templates
- **Commitlint**: `frontend/assets/commitlintrc.template.cjs`
- **ESLint Config**: `frontend/assets/eslint-config/`

### Quick Commands
```bash
pnpm cz              # Interactive commit
pnpm lint            # Format code
pnpm lint:style      # Format styles
```

---

**Last Updated**: 2026-01-13
**Version**: 1.0
**Maintainer**: Frontend Team