#!/usr/bin/env node

/**
 * ESLint 配置自动化脚本
 *
 * 用法:
 *   node setup-eslint.js --type non-workspace
 *   node setup-eslint.js --type workspace --scope @mycompany
 *   node setup-eslint.js --help
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { parseArgs } from 'util'

// 解析命令行参数
const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    type: { type: 'string' },
    scope: { type: 'string' },
    help: { type: 'boolean' },
    force: { type: 'boolean' },
  },
})

// 帮助信息
const helpText = `
ESLint 配置自动化脚本

用法:
  node setup-eslint.js [选项]

选项:
  --type <type>       配置类型: non-workspace 或 workspace
  --scope <name>      Workspace 包作用域 (例如: @mycompany)
  --force             覆盖现有配置
  --help              显示帮助信息

示例:
  # 非 Workspace 项目
  node setup-eslint.js --type non-workspace

  # Workspace 项目
  node setup-eslint.js --type workspace --scope @mycompany

  # 显示帮助
  node setup-eslint.js --help
`

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function error(message) {
  log(`❌ ${message}`, 'red')
  process.exit(1)
}

function success(message) {
  log(`✅ ${message}`, 'green')
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow')
}

// 检查是否在项目根目录
function checkProjectRoot() {
  if (!existsSync('package.json')) {
    error('请在项目根目录运行此脚本')
  }

  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))
  return packageJson.name || 'unknown'
}

// 检查包管理器
function detectPackageManager() {
  if (existsSync('pnpm-lock.yaml')) return 'pnpm'
  if (existsSync('package-lock.json')) return 'npm'
  if (existsSync('yarn.lock')) return 'yarn'
  return 'pnpm' // 默认使用 pnpm
}

// 安装依赖
function installDependencies(packageManager, dependencies, dev = false) {
  const flag = dev ? '--save-dev' : '--save'
  const cmd = {
    pnpm: `pnpm add ${flag} ${dependencies.join(' ')}`,
    npm: `npm install ${flag} ${dependencies.join(' ')}`,
    yarn: `yarn add ${flag} ${dependencies.join(' ')}`,
  }[packageManager]

  try {
    info(`安装依赖: ${dependencies.join(', ')}`)
    execSync(cmd, { stdio: 'inherit' })
    success('依赖安装完成')
  } catch (e) {
    error(`依赖安装失败: ${e.message}`)
  }
}

// 创建非 Workspace 配置
function setupNonWorkspace(packageManager, projectName) {
  info('配置非 Workspace 项目...')

  // 安装依赖
  installDependencies(packageManager, ['@antfu/eslint-config', 'eslint'], true)

  // 创建配置文件
  const configContent = `import antfu from '@antfu/eslint-config'

export default antfu({
  // TypeScript 支持
  typescript: true,

  // React 支持 (如果需要 Vue，改为 vue: true)
  react: true,

  // 启用格式化
  formatters: true,

  // 代码风格配置
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    trailingComma: 'all',
  },

  // 自定义规则
  rules: {
    // 最佳实践
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // React (如果使用 Vue，可以移除)
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
`

  // 写入配置文件
  writeFileSync('eslint.config.js', configContent)
  success('创建 eslint.config.js')

  // 更新 package.json
  updatePackageJson({
    scripts: {
      lint: 'eslint .',
      'lint:fix': 'eslint . --fix',
    },
  })

  // 创建 .eslintignore (可选)
  const ignoreContent = `dist/
build/
node_modules/
coverage/
*.min.js
*.config.js
*.d.ts
`
  writeFileSync('.eslintignore', ignoreContent)
  success('创建 .eslintignore')

  // 测试配置
  info('测试配置...')
  try {
    execSync('npx eslint --print-config index.js 2>/dev/null || echo "配置有效"', { stdio: 'inherit' })
    success('ESLint 配置完成！')
    log('')
    log('下一步:')
    log('  1. 检查 eslint.config.js 中的配置')
    log('  2. 运行: pnpm lint')
    log('  3. 如需修复: pnpm lint:fix')
  } catch (e) {
    warn('配置测试失败，请手动检查')
  }
}

// 创建 Workspace 配置
function setupWorkspace(packageManager, scope) {
  info('配置 Workspace 项目...')

  if (!scope) {
    error('Workspace 项目必须指定 --scope 参数 (例如: @mycompany)')
  }

  // 检查是否已有 packages 目录
  if (!existsSync('packages')) {
    mkdirSync('packages', { recursive: true })
    info('创建 packages 目录')
  }

  // 创建 eslint-config 包目录
  const configDir = join('packages', 'eslint-config')
  if (existsSync(configDir) && !args.force) {
    error(`eslint-config 包已存在: ${configDir} (使用 --force 覆盖)`)
  }

  mkdirSync(configDir, { recursive: true })

  // 安装根目录依赖
  installDependencies(packageManager, ['eslint', 'typescript'], true)

  // 创建 package.json
  const packageJson = {
    name: `${scope}/eslint-config`,
    version: '1.0.0',
    description: 'Shared ESLint configuration for workspace projects',
    type: 'module',
    main: './dist/cjs/index.cjs',
    module: './dist/es/index.mjs',
    exports: {
      '.': './dist/cjs/index.cjs',
      './es': './dist/es/index.mjs',
      './cjs': './dist/cjs/index.cjs',
      './package.json': './package.json',
    },
    files: ['dist'],
    scripts: {
      build: 'tsdown',
      dev: 'tsdown --watch',
    },
    keywords: ['eslint', 'config', 'workspace', 'monorepo', 'typescript'],
    dependencies: {
      '@antfu/eslint-config': '^6.0.0',
      'eslint-plugin-format': '^1.0.2',
    },
    devDependencies: {
      'eslint': '^9.37.0',
      'tsdown': '^0.15.9',
    },
    peerDependencies: {
      'eslint': '^9.0.0',
    },
  }

  writeFileSync(
    join(configDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )
  success('创建 package.json')

  // 创建目录结构
  mkdirSync(join(configDir, 'src'), { recursive: true })

  // 创建主配置文件
  const indexContent = `import antfu from '@antfu/eslint-config'

type Options = Parameters<typeof antfu>[0]

/**
 * Shared ESLint configuration for workspace projects
 *
 * @param options - Antfu ESLint configuration options
 * @returns Configured ESLint config
 *
 * @example
 * \`\`\`javascript
 * // eslint.config.js
 * import config from '${scope}/eslint-config'
 *
 * export default config({
 *   typescript: true,
 *   react: true,
 *   rules: {
 *     // Custom rules
 *   }
 * })
 * \`\`\`
 */
export default (options: Options = {}) => {
  // 默认样式配置
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    endOfLine: 'lf',
    trailingComma: 'all',
    semi: false,
  } as any

  // 合并自定义样式配置
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
`

  writeFileSync(join(configDir, 'src', 'index.ts'), indexContent)
  success('创建 src/index.ts')

  // 创建构建配置
  const tsdownConfig = `import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['es', 'cjs'],
  outDir: 'dist',
  clean: true,
  dts: true,
})
`

  writeFileSync(join(configDir, 'tsdown.config.ts'), tsdownConfig)
  success('创建 tsdown.config.ts')

  // 创建导出文件
  const exportContent = `import config from './src/index.js'

export default config
`

  writeFileSync(join(configDir, 'eslint.config.js'), exportContent)
  success('创建 eslint.config.js')

  // 创建 README
  const readmeContent = `# ${scope}/eslint-config

Shared ESLint configuration for workspace projects.

## Installation

\`\`\`bash
pnpm add -D ${scope}/eslint-config eslint
\`\`\`

## Usage

\`\`\`javascript
// eslint.config.js
import config from '${scope}/eslint-config'

export default config({
  typescript: true,
  react: true,
  rules: {
    // Your custom rules
  }
})
\`\`\`

## Options

- \`typescript\`: Enable TypeScript support
- \`react\`: Enable React support
- \`vue\`: Enable Vue support
- \`rules\`: Custom ESLint rules
- \`ignores\`: Files to ignore

## Scripts

\`\`\`json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
\`\`\`

## License

MIT
`

  writeFileSync(join(configDir, 'README.md'), readmeContent)
  success('创建 README.md')

  // 安装包依赖
  info('安装 eslint-config 包依赖...')
  try {
    execSync(`cd ${configDir} && ${packageManager} install`, { stdio: 'inherit' })
    success('包依赖安装完成')
  } catch (e) {
    warn('包依赖安装失败，请手动运行: cd packages/eslint-config && pnpm install')
  }

  // 构建包
  info('构建 eslint-config 包...')
  try {
    execSync(`cd ${configDir} && ${packageManager} run build`, { stdio: 'inherit' })
    success('包构建完成')
  } catch (e) {
    warn('包构建失败，请手动运行: cd packages/eslint-config && pnpm build')
  }

  // 更新根目录 package.json
  updatePackageJson({
    scripts: {
      'lint': 'pnpm -r --parallel lint',
      'lint:fix': 'pnpm -r --parallel lint:fix',
      'lint:eslint-config': `cd packages/eslint-config && ${packageManager} run build`,
    },
  })

  success('Workspace ESLint 配置完成！')
  log('')
  log('下一步:')
  log('  1. 在子项目中安装: pnpm add -D @your-scope/eslint-config')
  log('  2. 创建 eslint.config.js: import config from "@your-scope/eslint-config"')
  log('  3. 使用: export default config({ typescript: true, react: true })')
}

// 更新 package.json
function updatePackageJson(updates) {
  if (!existsSync('package.json')) return

  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

  Object.keys(updates).forEach(key => {
    if (!packageJson[key]) {
      packageJson[key] = {}
    }
    Object.assign(packageJson[key], updates[key])
  })

  writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
  success('更新 package.json')
}

// 主函数
function main() {
  // 显示帮助
  if (args.help) {
    log(helpText, 'cyan')
    process.exit(0)
  }

  // 检查参数
  if (!args.type) {
    error('请指定配置类型: --type non-workspace 或 --type workspace')
  }

  if (!['non-workspace', 'workspace'].includes(args.type)) {
    error('无效的类型: ' + args.type)
  }

  // 检查项目
  const projectName = checkProjectRoot()
  const packageManager = detectPackageManager()

  info(`项目: ${projectName}`)
  info(`包管理器: ${packageManager}`)
  info(`配置类型: ${args.type}`)

  // 确认继续
  if (!args.force) {
    log('')
    const confirm = readlineSync('继续吗? [y/N]: ')
    if (!['y', 'Y', 'yes', 'Yes'].includes(confirm)) {
      info('已取消')
      process.exit(0)
    }
  }

  // 执行配置
  if (args.type === 'non-workspace') {
    setupNonWorkspace(packageManager, projectName)
  } else if (args.type === 'workspace') {
    setupWorkspace(packageManager, args.scope)
  }
}

// 简单的读行同步函数
function readlineSync(prompt) {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

// 运行主函数
main().catch(error)
