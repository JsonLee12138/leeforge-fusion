// Commitlint 配置模板
// 使用方式：复制到项目根目录，重命名为 .commitlintrc.cjs

/** @type {import('cz-git').UserConfig} */
module.exports = {
  // 继承 Conventional Commits 规范
  extends: ['@commitlint/config-conventional'],

  // 自定义规则
  rules: {
    // 提交类型枚举
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']
    ],

    // subject 最大长度
    'subject-max-length': [2, 'always', 100],

    // subject 最小长度
    'subject-min-length': [2, 'always', 3],

    // subject 不以句号结尾
    'subject-full-stop': [2, 'never', '.'],

    // type 为小写
    'type-case': [2, 'always', 'lower-case']
  },

  // 交互式提交提示配置（中英双语）
  prompt: {
    // 别名
    alias: {
      fd: 'docs: fix typos'
    },

    // 提示消息
    messages: {
      type: "选择你要提交的类型 | Select the type of change that you're committing:",
      scope: '选择一个提交范围（可选）| Denote the SCOPE of this change (optional):',
      customScope: '请输入自定义的提交范围 | Denote the SCOPE of this change:',
      subject: '填写简短精炼的变更描述 | Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 | Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 | List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）| Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: '输入自定义issue前缀 | Input ISSUES prefix:',
      footer: '列举关联issue (可选) 例如: #31, #I3244 | List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: '是否提交或修改commit ? | Are you sure you want to proceed with the commit above?'
    },

    // 提交类型选项
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

    // 交互式配置
    useEmoji: false,              // 不使用 emoji
    emojiAlign: 'center',         // emoji 对齐方式
    useAI: false,                 // 不使用 AI
    aiNumber: 1,                  // AI 建议数量
    themeColorCode: '',           // 主题颜色代码

    // Scope 配置
    scopes: [],                   // 自定义 scopes 列表
    allowCustomScopes: true,      // 允许自定义 scope
    allowEmptyScopes: true,       // 允许空 scope
    customScopesAlign: 'bottom',  // 自定义 scope 对齐
    customScopesAlias: 'custom',  // 自定义 scope 别名
    emptyScopesAlias: 'empty',    // 空 scope 别名

    // Subject 配置
    upperCaseSubject: false,      // subject 不大写
    markBreakingChangeMode: false, // 不标记破坏性变更

    // Breaking changes 配置
    allowBreakingChanges: ['feat', 'fix'],  // 允许破坏性变更的类型
    breaklineNumber: 100,         // 换行长度
    breaklineChar: '|',           // 换行字符

    // 跳过的问题
    skipQuestions: [],

    // Issue 前缀
    issuePrefixes: [
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' }
    ],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,

    // 其他配置
    confirmColorize: true,        // 彩色确认信息
    scopeOverrides: undefined,    // Scope 覆盖
    defaultBody: '',              // 默认正文
    defaultIssues: '',            // 默认 issues
    defaultScope: '',             // 默认 scope
    defaultSubject: ''            // 默认 subject
  }
}
