#!/usr/bin/env node

/**
 * 快速切换 ESLint 配置方案
 *
 * 用法:
 *   node quick-switch.js non-workspace  # 切换到非 workspace 配置
 *   node quick-switch.js workspace      # 切换到 workspace 配置
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { parseArgs } from 'util'

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    force: { type: 'boolean' },
    help: { type: 'boolean' },
  },
})

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`)
}

function error(msg) {
  log(`❌ ${msg}`, 'red')
  process.exit(1)
}

function success(msg) {
  log(`✅ ${msg}`, 'green')
}

function info(msg) {
  log(`ℹ️  ${msg}`, 'blue')
}

// 配置模板
const templates = {
  'non-workspace': {
    name: '非 Workspace 配置',
    description: '使用 @antfu/eslint-config，适合独立项目',
    file: 'eslint.config.js',
    content: `import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    trailingComma: 'all',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
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
`,
  },
  'workspace': {
    name: 'Workspace 配置',
    description: '封装为独立包，适合 Monorepo',
    file: 'packages/eslint-config/src/index.ts',
    content: `import antfu from '@antfu/eslint-config'

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
`,
  },
}

// 显示帮助
function showHelp() {
  log(`
快速切换 ESLint 配置方案

用法:
  node quick-switch.js <type> [选项]

类型:
  non-workspace    非 Workspace 配置 (使用 @antfu/eslint-config)
  workspace        Workspace 配置 (封装为包)

选项:
  --force          覆盖现有配置
  --help           显示帮助信息

示例:
  node quick-switch.js non-workspace
  node quick-switch.js workspace --force

当前配置对比:
  ┌─────────────────┬──────────────────┬──────────────────┐
  │ 特性            │ 非 Workspace     │ Workspace        │
  ├─────────────────┼──────────────────┼──────────────────┤
  │ 配置复杂度      │ ⭐⭐⭐⭐⭐        │ ⭐⭐⭐            │
  │ 复用性          │ ⭐⭐             │ ⭐⭐⭐⭐⭐        │
  │ 维护成本        │ ⭐⭐⭐⭐⭐        │ ⭐⭐⭐            │
  │ 适合场景        │ 独立项目         │ Monorepo/团队    │
  └─────────────────┴──────────────────┴──────────────────┘
  `, 'cyan')
}

// 检查项目类型
function checkProjectType() {
  const hasWorkspace = existsSync('pnpm-workspace.yaml') ||
                      existsSync('lerna.json') ||
                      existsSync('rush.json')

  const hasPackages = existsSync('packages')

  return {
    isWorkspace: hasWorkspace || hasPackages,
    hasWorkspaceConfig: existsSync('packages/eslint-config'),
    hasNonWorkspaceConfig: existsSync('eslint.config.js'),
  }
}

// 备份现有配置
function backupConfig(filePath) {
  if (!existsSync(filePath)) return

  const backupPath = `${filePath}.backup.${Date.now()}`
  const content = readFileSync(filePath, 'utf-8')
  writeFileSync(backupPath, content)
  info(`已备份: ${backupPath}`)
}

// 应用配置
function applyConfig(type, force = false) {
  const template = templates[type]
  if (!template) {
    error(`未知配置类型: ${type}`)
  }

  info(`应用配置: ${template.name}`)
  log(`描述: ${template.description}`)

  // 检查现有配置
  const projectInfo = checkProjectType()

  if (type === 'workspace' && !projectInfo.isWorkspace) {
    warn('当前项目看起来不是 Workspace 项目')
    warn('建议: 先创建 pnpm-workspace.yaml 或使用非 Workspace 配置')

    if (!force) {
      const confirm = require('readline-sync').question('继续吗? [y/N]: ')
      if (!['y', 'Y'].includes(confirm)) {
        info('已取消')
        process.exit(0)
      }
    }
  }

  // 备份
  if (existsSync(template.file) && !force) {
    backupConfig(template.file)
  }

  // 创建目录
  const dir = template.file.split('/').slice(0, -1).join('/')
  if (dir && !existsSync(dir)) {
    const { mkdirSync } = require('fs')
    mkdirSync(dir, { recursive: true })
    info(`创建目录: ${dir}`)
  }

  // 写入配置
  writeFileSync(template.file, template.content)
  success(`创建配置文件: ${template.file}`)

  // 更新 package.json
  updatePackageScripts(type)

  // 显示下一步
  showNextSteps(type)
}

// 更新 package.json 脚本
function updatePackageScripts(type) {
  if (!existsSync('package.json')) return

  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }

  if (type === 'non-workspace') {
    packageJson.scripts.lint = 'eslint .'
    packageJson.scripts['lint:fix'] = 'eslint . --fix'
  } else if (type === 'workspace') {
    packageJson.scripts.lint = 'pnpm -r --parallel lint'
    packageJson.scripts['lint:fix'] = 'pnpm -r --parallel lint:fix'
    packageJson.scripts['lint:eslint-config'] = 'cd packages/eslint-config && pnpm build'
  }

  writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
  success('更新 package.json 脚本')
}

// 显示下一步
function showNextSteps(type) {
  log('')
  log('下一步:', 'yellow')

  if (type === 'non-workspace') {
    log('  1. 安装依赖: pnpm add -D eslint @antfu/eslint-config', 'blue')
    log('  2. 测试配置: npx eslint --print-config index.js', 'blue')
    log('  3. 运行检查: pnpm lint', 'blue')
  } else {
    log('  1. 进入包目录: cd packages/eslint-config', 'blue')
    log('  2. 安装依赖: pnpm install', 'blue')
    log('  3. 构建包: pnpm build', 'blue')
    log('  4. 在子项目中使用: pnpm add -D @your-scope/eslint-config', 'blue')
  }
}

// 主函数
function main() {
  const [type] = process.argv.slice(2).filter(arg => !arg.startsWith('--'))

  if (args.help || !type) {
    showHelp()
    process.exit(0)
  }

  if (!['non-workspace', 'workspace'].includes(type)) {
    error(`无效类型: ${type}\n可用类型: non-workspace, workspace`)
  }

  // 显示当前状态
  const projectInfo = checkProjectType()
  info('当前项目状态:')
  log(`  Workspace: ${projectInfo.isWorkspace ? '是' : '否'}`)
  log(`  已有 Workspace 配置: ${projectInfo.hasWorkspaceConfig ? '是' : '否'}`)
  log(`  已有非 Workspace 配置: ${projectInfo.hasNonWorkspaceConfig ? '是' : '否'}`)
  log('')

  applyConfig(type, args.force)
}

// 运行
main().catch(error)
