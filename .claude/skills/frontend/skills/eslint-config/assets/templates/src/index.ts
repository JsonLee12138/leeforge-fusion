import antfu from '@antfu/eslint-config'

type Options = Parameters<typeof antfu>[0]

/**
 * Shared ESLint configuration for workspace projects
 *
 * @param options - Antfu ESLint configuration options
 * @returns Configured ESLint config
 *
 * @example
 * ```javascript
 * // eslint.config.js
 * import config from '@your-scope/eslint-config'
 *
 * export default config({
 *   typescript: true,
 *   react: true,
 *   rules: {
 *     // Custom rules
 *   }
 * })
 * ```
 */
export default (options: Options = {}) => {
  // 默认样式配置
  const stylisticConfig = {
    indent: 2,
    quotes: 'single',
    endOfLine: 'lf',
    trailingComma: 'all',
    semi: true,
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
    // 默认启用 TypeScript 和 React 支持
    typescript: true,
    react: true,
    ...options,
  })
}