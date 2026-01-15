# Frontend Standards & Skills

> A complete collection of frontend development standards, best practices, and Claude Skills for modern web development.

## 📁 Directory Structure

```
frontend/
├── docs/                           # Documentation
│   ├── INDEX.md                    # Quick navigation
│   ├── SUMMARY.md                  # Overview
│   ├── setup-guide.md              # 5-minute setup guide
│   ├── standards.md                # Complete standards (38KB)
│   └── FILE-LIST.md                # File list reference
│
├── skills/                         # Claude Skills
│   ├── README.md                   # Skills overview
│   ├── CLAUDE_USAGE.md            # Usage examples
│   ├── INSTALLATION.md            # Setup guide
│   ├── SUMMARY.md                 # Skills summary
│   │
│   └── frontend-standard/          # Main skill
│       ├── SKILL.md               # Core skill content
│       └── USAGE-RULES.md         # Detailed guidelines
│
├── templates/                      # Configuration templates
│   ├── commitlintrc.template.cjs  # Commitlint config
│   └── eslint-config/             # Workspace ESLint package
│
└── README.md                       # This file
```

## 📚 Documentation Guide

### Original Documents (docs/)
These are detailed reference documents for deep reading:

| Document | Size | Purpose |
|----------|------|---------|
| **standards.md** | 38KB | Complete frontend standards & best practices |
| **setup-guide.md** | 10KB | 5-minute quick setup guide |
| **INDEX.md** | 5KB | Quick navigation & lookup |
| **SUMMARY.md** | 7KB | Overview & key concepts |
| **FILE-LIST.md** | 8KB | Complete file reference |

### Claude Skills (skills/)
These are optimized skill files for direct use in Claude Code:

| Skill | Purpose | Usage |
|-------|---------|-------|
| **@frontend/frontend-standard** | Frontend standards & patterns | `@frontend/frontend-standard` |

## 🚀 Quick Start

### Option 1: Use Claude Skills (Recommended)

In Claude Code, directly reference the skill:

```bash
# Get started
@frontend/frontend-standard I'm starting a new frontend project

# Create components
@frontend/frontend-standard Create a UserCard component

# Code review
@frontend/frontend-standard Review this code: [paste code]
```

### Option 2: Read Documentation

```bash
# Quick setup
cat docs/frontend/setup-guide.md

# Full standards
cat docs/frontend/standards.md

# Quick index
cat docs/frontend/INDEX.md
```

## 🎯 Core Concepts

### 1. Naming Conventions
| Type | Rule | Example |
|------|------|---------|
| Components | PascalCase | `ArticleCard.tsx` |
| Hooks | camelCase + use | `useModal.ts` |
| Variables | camelCase | `userName` |
| Constants | UPPER_SNAKE_CASE | `MAX_SIZE` |
| Routes | kebab-case | `user-profile.tsx` |

### 2. Code Style
- **ESLint**: `@antfu/eslint-config`
- **Indent**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: None
- **TypeScript**: Strict mode

### 3. Key Practices
1. **Bilingual Code**: Comments in Chinese, code in English
2. **Enum Library**: `@jsonlee_12138/enum`
3. **CSS Variables**: Theme system
4. **Icon System**: SVG + UnoCSS
5. **CSS Framework**: UnoCSS + presetWind4 + presetAliasColors

### 4. Git Workflow
```bash
# Format
type(scope): subject

# Examples
feat(components): add ArticleCard component
fix(hooks): resolve useModal memory leak
docs: update API documentation

# Use
pnpm cz  # Interactive commit
```

## 🚀 Usage Examples

### Scenario 1: New Project Setup
```bash
# 1. Read setup guide
cat docs/frontend/setup-guide.md

# 2. Ask skill for specific help
@frontend/frontend-standard Show me the complete dependency list

# 3. Copy templates
cp docs/frontend/templates/commitlintrc.template.cjs .commitlintrc.cjs
```

### Scenario 2: Component Development
```bash
# Ask skill to create component
@frontend/frontend-standard Create a Button component with proper types and styling

# Review your code
@frontend/frontend-standard Review this component for compliance
```

### Scenario 3: Workspace Configuration
```bash
# Ask skill for Workspace setup
@frontend/frontend-standard How do I create a shared ESLint config for monorepo?

# Follow the guide
cat docs/frontend/templates/eslint-config/
```

### Scenario 4: Code Review
```bash
# Use skill for review
@frontend/frontend-standard Check this code:
- Naming conventions
- Code style
- Best practices
- TypeScript types
```

## 🔧 Tools & Dependencies

### Core Dependencies
```json
{
  "devDependencies": {
    "@antfu/eslint-config": "^latest",
    "eslint": "^9.18.0",
    "typescript": "^5.7.3",
    "unocss": "^0.65.4",
    "@unocss/preset-wind4": "^0.65.4",
    "@jsonlee_12138/preset-alias-colors": "latest",
    "@commitlint/cli": "^19.6.1",
    "cz-git": "^1.11.0",
    "husky": "^9.1.7",
    "lint-staged": "^15.3.0"
  }
}
```

### Package Scripts
```json
{
  "scripts": {
    "cz": "cz",
    "lint": "eslint --fix .",
    "lint:style": "prettier --write .",
    "prepare": "husky install"
  }
}
```

## 📖 Learning Path

### For Beginners
1. **Start Here**: `docs/frontend/setup-guide.md` (5 min)
2. **Learn Standards**: `docs/frontend/standards.md` (30 min)
3. **Use Skills**: `@frontend/frontend-standard` for help

### For Teams
1. **Share Standards**: Share this directory
2. **Use Skills**: Train team on `@frontend/frontend-standard`
3. **Review Together**: Use checklist in standards

### For Advanced Users
1. **Workspace Setup**: Use `templates/eslint-config/`
2. **Custom Skills**: Modify `skills/frontend-standard/SKILL.md`
3. **Template Updates**: Update `templates/commitlintrc.template.cjs`

## ✅ Quick Checklist

### Project Init
- [ ] Install core dependencies
- [ ] Configure ESLint
- [ ] Configure UnoCSS
- [ ] Configure TypeScript
- [ ] Setup Commitlint
- [ ] Setup Husky hooks
- [ ] Configure lint-staged
- [ ] Add package.json scripts

### Code Quality
- [ ] File names follow conventions
- [ ] TypeScript types complete
- [ ] Comments in Chinese
- [ ] UnoCSS used
- [ ] Lint passes
- [ ] Commit message follows format

## 🎯 When to Use What

### Use Claude Skill (@frontend/frontend-standard) When:
- Creating new components
- Code review
- Tool configuration
- Naming questions
- Best practice guidance
- Workspace setup

### Use Documentation When:
- Deep learning
- Team training
- Reference lookup
- Understanding concepts
- Detailed examples

### Use Templates When:
- New project setup
- Configuring tools
- Creating shared packages

## 📞 Support

### Quick Help
```bash
# Use the skill
@frontend/frontend-standard How do I...?

# Read setup guide
cat docs/frontend/setup-guide.md
```

### Common Issues
- **ESLint config**: Use `@frontend/frontend-standard` for Workspace setup
- **Naming**: Check `docs/frontend/standards.md` naming section
- **UnoCSS**: See `docs/frontend/standards.md` CSS system section
- **Commit format**: Use `pnpm cz` for interactive commits

## 🔄 Updates & Maintenance

### To Update Documentation
1. Edit files in `docs/`
2. Update `skills/frontend-standard/SKILL.md` if needed
3. Update version info in all files

### To Add Features
1. Add to `docs/standards.md`
2. Update `skills/frontend-standard/SKILL.md`
3. Add examples to `skills/CLAUDE_USAGE.md`

## 🎉 Getting Started

### Option 1: Quick Start (5 minutes)
```bash
cat docs/frontend/setup-guide.md
```

### Option 2: Full Standards (30 minutes)
```bash
cat docs/frontend/standards.md
```

### Option 3: Use AI Assistant (Recommended)
```bash
@frontend/frontend-standard I'm new to this project, where should I start?
```

---

**Ready to build amazing frontend applications?** 🚀

Start with `docs/frontend/setup-guide.md` or use `@frontend/frontend-standard` in Claude Code!

---
*Last Updated: 2026-01-13*
*Version: 1.0.0*
*Status: Production Ready*
