---
name: eslint-config
description: Configure ESLint for projects using @antfu/eslint-config for non-workspace or workspace packages for monorepo setups
---

# ESLint Config

## Overview

Configure ESLint for frontend projects with two options: non-workspace using @antfu/eslint-config or workspace packages for monorepo setups. Use this skill when setting up new projects, configuring code standards, or migrating existing projects.

## When To Use This Skill

**Use this skill when:**
- Setting up a new frontend project with ESLint
- Configuring code standards for existing projects
- Creating shared ESLint configurations for monorepo workspaces
- Migrating from old ESLint config to flat config format
- Need to choose between non-workspace and workspace approaches

**Trigger phrases:**
- "Configure ESLint for my project"
- "Set up ESLint with @antfu/eslint-config"
- "Create workspace ESLint package"
- "How do I configure ESLint for monorepo?"
- "Migrate to ESLint v9 flat config"

## Quick Start

### Option 1: Non-Workspace (Single Project)

**To configure a single project, do:**

1. **Install dependencies:**
   ```bash
   pnpm add -D eslint @antfu/eslint-config
   ```

2. **Create eslint.config.js:**
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
     ignores: [
       'dist/',
       'build/',
       'node_modules/',
       'coverage/',
     ],
   })
   ```

3. **Add scripts to package.json:**
   ```json
   {
     "scripts": {
       "lint": "eslint .",
       "lint:fix": "eslint . --fix"
     }
   }
   ```

4. **Test the configuration:**
   ```bash
   pnpm lint
   ```

### Option 2: Workspace (Monorepo)

**To create a shared workspace package, do:**

1. **Create the package structure:**
   ```bash
   mkdir -p packages/eslint-config/src
   cd packages/eslint-config
   pnpm init
   ```

2. **Configure package.json:**
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
       "build": "tsdown",
       "dev": "tsdown --watch"
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

3. **Create src/index.ts:**
   ```typescript
   import antfu from '@antfu/eslint-config'

   type Options = Parameters<typeof antfu>[0]

   export default (options: Options = {}) => {
     const stylisticConfig = {
       indent: 2,
       quotes: 'single',
       endOfLine: 'lf',
       trailingComma: 'all',
       semi: false,
     } as any

     if (typeof options.stylistic === 'object') {
       Object.assign(stylisticConfig, options.stylistic)
       delete options.stylistic
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

4. **Build the package:**
   ```bash
   pnpm install
   pnpm build
   ```

5. **Use in subprojects:**
   ```javascript
   // apps/my-app/eslint.config.js
   import config from '@your-scope/eslint-config'

   export default config({
     rules: {
       'no-console': 'warn',
     },
   })
   ```

## Configuration Decision Tree

**Choose your approach:**

```
Project Type?
├── Single Project → Non-Workspace
│   └── Use: @antfu/eslint-config directly
│
├── Multiple Projects → Workspace?
│   ├── Yes (Monorepo) → Workspace Package
│   │   └── Use: packages/eslint-config/
│   │
│   └── No (Separate repos) → Non-Workspace per project
│       └── Use: @antfu/eslint-config in each
```

## Non-Workspace Configuration

### Basic Setup

**To configure non-workspace projects, do:**

1. **Install:**
   ```bash
   pnpm add -D eslint @antfu/eslint-config
   ```

2. **Create eslint.config.js:**
   ```javascript
   import antfu from '@antfu/eslint-config'

   export default antfu({
     // Framework support
     typescript: true,
     react: true,  // or vue: true
     formatters: true,

     // Code style
     stylistic: {
       indent: 2,
       quotes: 'single',
       semi: false,
       trailingComma: 'all',
     },

     // Custom rules
     rules: {
       'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
       '@typescript-eslint/no-explicit-any': 'off',
       '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
     },

     // Ignore files
     ignores: [
       'dist/',
       'build/',
       'node_modules/',
       'coverage/',
       '*.min.js',
       '*.config.js',
     ],
   })
   ```

### Framework Variations

**React:**
```javascript
export default antfu({
  typescript: true,
  react: true,
  formatters: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
})
```

**Vue:**
```javascript
export default antfu({
  typescript: true,
  vue: true,
  react: false,
  formatters: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
})
```

**Node.js:**
```javascript
export default antfu({
  typescript: true,
  formatters: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
})
```

## Workspace Configuration

### Package Structure

**To create workspace ESLint package, do:**

```
packages/eslint-config/
├── src/
│   └── index.ts          # Main configuration
├── eslint.config.js      # Local development config
├── tsdown.config.ts      # Build configuration
├── package.json          # Package metadata
└── README.md             # Documentation
```

### Package Implementation

**To implement the package, do:**

1. **Use the existing template:**
   ```bash
   cp -r frontend/assets/eslint-config packages/eslint-config
   ```

2. **Update package.json:**
   ```json
   {
     "name": "@your-scope/eslint-config",
     "version": "1.0.0",
     "description": "Shared ESLint configuration for workspace projects",
     "type": "module",
     "main": "./dist/cjs/index.cjs",
     "module": "./dist/es/index.mjs",
     "exports": {
       ".": "./dist/cjs/index.cjs",
       "./es": "./dist/es/index.mjs",
       "./cjs": "./dist/cjs/index.cjs",
       "./package.json": "./package.json"
     },
     "files": ["dist"],
     "scripts": {
       "build": "tsdown",
       "dev": "tsdown --watch"
     },
     "dependencies": {
       "@antfu/eslint-config": "^6.0.0",
       "eslint-plugin-format": "^1.0.2"
     },
     "devDependencies": {
       "eslint": "^9.37.0",
       "tsdown": "^0.15.9"
     },
     "peerDependencies": {
       "eslint": "^9.0.0"
     }
   }
   ```

3. **Build and use:**
   ```bash
   cd packages/eslint-config
   pnpm install
   pnpm build

   # In subproject
   cd ../apps/my-app
   pnpm add -D @your-scope/eslint-config eslint
   ```

### Subproject Usage

**To use in subprojects, do:**

```javascript
// eslint.config.js
import config from '@your-scope/eslint-config'

export default config({
  // Override defaults
  react: false,
  vue: true,

  // Custom rules
  rules: {
    'no-console': 'warn',
  },

  // Additional ignores
  ignores: ['custom/'],
})
```

## Common Workflows

### Workflow 1: New Project Setup

**To set up a new project, do:**

1. **Choose approach** (see decision tree above)
2. **Run configuration** (use scripts below)
3. **Install dependencies**
4. **Test with `pnpm lint`**
5. **Add to CI/CD pipeline**

### Workflow 2: Migration from Old Config

**To migrate from .eslintrc to flat config, do:**

1. **Install new dependencies:**
   ```bash
   pnpm add -D eslint @antfu/eslint-config
   pnpm remove eslint-config-*  # Remove old configs
   ```

2. **Create new config:**
   ```javascript
   // Old: .eslintrc.js
   // New: eslint.config.js
   import antfu from '@antfu/eslint-config'

   export default antfu({
     // Map old rules to new format
     rules: {
       // Your existing rules here
     }
   })
   ```

3. **Remove old config files:**
   ```bash
   rm .eslintrc.js .eslintrc.json .prettierrc
   ```

4. **Test and fix issues:**
   ```bash
   pnpm lint
   ```

### Workflow 3: Update Workspace Config

**To update shared workspace config, do:**

1. **Modify packages/eslint-config/src/index.ts**
2. **Rebuild the package:**
   ```bash
   cd packages/eslint-config
   pnpm build
   ```
3. **Update subprojects:**
   ```bash
   cd apps/my-app
   pnpm update @your-scope/eslint-config
   pnpm lint
   ```

## Resources

### Scripts

This skill includes executable scripts for common ESLint configuration tasks:

**`setup-eslint.js`** - Automated configuration setup
- Detects project type (workspace/non-workspace)
- Creates configuration files
- Installs dependencies
- Validates setup

**Usage:**
```bash
# Non-workspace
node setup-eslint.js --type non-workspace

# Workspace
node setup-eslint.js --type workspace --scope @yourcompany
```

**`quick-switch.js`** - Switch between configuration types
- Converts non-workspace to workspace
- Converts workspace to non-workspace
- Backs up existing configs

**Usage:**
```bash
node quick-switch.js non-workspace
node quick-switch.js workspace
```

### References

**`non-workspace-config.md`** - Detailed non-workspace configuration guide
- Complete configuration options
- Framework-specific examples
- Troubleshooting guide
- Best practices

**`workspace-config.md`** - Complete workspace package guide
- Package structure
- Build process
- Publishing instructions
- Subproject integration

**`comparison.md`** - Configuration comparison
- Feature comparison table
- Use case recommendations
- Migration guide

### Assets

**`templates/eslint-config/`** - Workspace package template
- Complete package structure
- Pre-configured files
- Build configuration
- Ready to copy and customize

**`templates/non-workspace/`** - Non-workspace template
- eslint.config.js template
- package.json scripts
- .eslintignore template

## Quality Standards

### Configuration Checklist

**Before deploying, verify:**
- [ ] Config file exists and is named correctly
- [ ] Dependencies are installed
- [ ] Scripts are added to package.json
- [ ] Testing passes (`pnpm lint`)
- [ ] CI/CD pipeline includes linting
- [ ] Team members know how to use it

### Code Style Requirements

**All configurations must use:**
- ✅ 2 spaces indentation
- ✅ Single quotes
- ✅ No semicolons
- ✅ Trailing commas
- ✅ ESLint v9 flat config format

### Validation

**To validate configuration, do:**
```bash
# Check config is readable
npx eslint --print-config index.js

# Test on actual files
npx eslint src/index.ts

# Auto-fix issues
npx eslint . --fix
```

## Troubleshooting

### Common Issues

**Issue: "Config not found"**
- Solution: Ensure file is named `eslint.config.js` (not `.eslintrc.js`)
- Solution: Place in project root directory

**Issue: "TypeScript errors"**
- Solution: Install TypeScript: `pnpm add -D typescript`
- Solution: Create `tsconfig.json`: `npx tsc --init`

**Issue: "Workspace package not found"**
- Solution: Build the package: `cd packages/eslint-config && pnpm build`
- Solution: Install in subproject: `pnpm add -D @your-scope/eslint-config`

**Issue: "Rules not applying"**
- Solution: Check config syntax: `export default config({...})`
- Solution: Verify rules are in `rules` object

## Advanced Usage

### Custom Stylistic Rules

**To customize code style, do:**
```javascript
export default antfu({
  stylistic: {
    indent: 4,           // Change from 2
    quotes: 'double',    // Change from single
    semi: true,          // Add semicolons
    trailingComma: 'es5', // Different trailing comma style
  },
})
```

### Environment-Specific Rules

**To have different rules per environment, do:**
```javascript
const isProd = process.env.NODE_ENV === 'production'

export default antfu({
  rules: {
    'no-console': isProd ? 'error' : 'warn',
    'no-debugger': isProd ? 'error' : 'warn',
  },
})
```

### Multiple Configurations

**To export multiple configs from workspace package, do:**
```typescript
// packages/eslint-config/src/index.ts
export const react = (options = {}) => config({ react: true, ...options })
export const vue = (options = {}) => config({ vue: true, ...options })
export const node = (options = {}) => config({ react: false, vue: false, ...options })

// Usage in subproject
import { react } from '@your-scope/eslint-config'
export default react({ rules: { 'no-console': 'warn' } })
```

## Related Skills

- **@frontend/frontend-standard** - Complete frontend standards including ESLint
- **@frontend/typescript-config** - TypeScript configuration
- **@frontend/prettier-config** - Prettier configuration

## References

For detailed information, see:
- `references/non-workspace-config.md` - Non-workspace guide
- `references/workspace-config.md` - Workspace guide
- `references/comparison.md` - Comparison and decision guide
- `assets/templates/` - Ready-to-use templates
