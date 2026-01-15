# ESLint Config Skill - 使用指南

> 这是一个符合 skill-creator 规范的 ESLint 配置技能，支持非 Workspace 和 Workspace 两种配置方案

## 📋 Skill 信息

- **名称**: `eslint-config`
- **描述**: Configure ESLint for projects using @antfu/eslint-config for non-workspace or workspace packages for monorepo setups
- **位置**: `frontend/skills/eslint-config/`

## 🎯 何时使用

**使用场景:**
- ✅ 设置新项目的 ESLint 配置
- ✅ 配置代码规范标准
- ✅ 创建共享的 ESLint 配置包
- ✅ 迁移到 ESLint v9 平面配置
- ✅ 在 Monorepo 中统一 ESLint 配置

**触发短语:**
- "Configure ESLint for my project"
- "Set up ESLint with @antfu/eslint-config"
- "Create workspace ESLint package"
- "How do I configure ESLint for monorepo?"
- "Migrate to ESLint v9 flat config"

## 🚀 快速使用

### 在 Claude Code 中使用

```bash
# 1. 询问 ESLint 配置
@frontend/eslint-config I need to configure ESLint for my React project

# 2. 根据提示选择方案
#    - 单个项目 → 非 Workspace
#    - Monorepo → Workspace

# 3. 按照 SKILL.md 中的步骤操作
```

### 直接使用脚本

```bash
# 进入 skill 目录
cd frontend/skills/eslint-config

# 查看可用脚本
ls scripts/

# 运行配置脚本
node scripts/setup-eslint.js --help
```

## 📁 Skill 结构

```
frontend/skills/eslint-config/
├── SKILL.md                    # 主技能文件
├── scripts/                    # 可执行脚本
│   ├── setup-eslint.js        # 一键配置脚本
│   └── quick-switch.js        # 配置切换脚本
├── references/                 # 详细文档
│   ├── non-workspace-config.md # 非 Workspace 指南
│   ├── workspace-config.md     # Workspace 指南
│   └── comparison.md          # 对比和决策指南
└── assets/                     # 模板文件
    └── templates/              # 配置模板
        ├── eslint-config/      # Workspace 包模板
        └── 非 Workspace 模板文件
```

## 📚 内容概览

### SKILL.md
- 完整的配置指南
- 决策树帮助选择方案
- 详细的工作流程
- 故障排除指南

### Scripts (scripts/)
- **setup-eslint.js**: 自动化配置脚本
  - 检测项目类型
  - 创建配置文件
  - 安装依赖
  - 验证配置

- **quick-switch.js**: 快速切换配置类型
  - 非 Workspace ↔ Workspace
  - 备份现有配置

### References (references/)
- **non-workspace-config.md**: 非 Workspace 详细指南
- **workspace-config.md**: Workspace 包开发指南
- **comparison.md**: 配置对比和选择指南

### Assets (assets/templates/)
- **eslint-config/**: 完整的 Workspace 包模板
  - `src/index.ts` - 主配置文件
  - `package.json` - 包配置
  - `tsdown.config.ts` - 构建配置
  - `eslint.config.js` - 开发配置

## 🔧 使用示例

### 场景 1: 新项目配置

**用户**: "我要为 React 项目配置 ESLint"

**Claude 会**:
1. 识别这是非 Workspace 配置需求
2. 提供 `eslint.config.js` 模板
3. 给出安装命令
4. 提供测试步骤

### 场景 2: Monorepo 配置

**用户**: "我们的 Monorepo 需要共享 ESLint 配置"

**Claude 会**:
1. 识别这是 Workspace 配置需求
2. 提供包创建步骤
3. 给出子项目使用方法
4. 说明构建和发布流程

### 场景 3: 配置切换

**用户**: "我想把现有项目从非 Workspace 改为 Workspace"

**Claude 会**:
1. 解释两种方案的区别
2. 提供迁移步骤
3. 使用 `quick-switch.js` 脚本
4. 验证迁移结果

## 🎨 配置方案对比

| 特性 | 非 Workspace | Workspace |
|------|-------------|-----------|
| **配置文件** | `eslint.config.js` | `packages/eslint-config/` |
| **复用性** | ❌ 无 | ✅ 完美 |
| **配置时间** | 5 分钟 | 15 分钟 |
| **维护成本** | 高 (多项目) | 低 (集中) |
| **适合场景** | 独立项目 | Monorepo |

## 🛠️ 脚本使用

### setup-eslint.js

```bash
# 查看帮助
node scripts/setup-eslint.js --help

# 非 Workspace 配置
node scripts/setup-eslint.js --type non-workspace

# Workspace 配置
node scripts/setup-eslint.js --type workspace --scope @yourcompany

# 强制覆盖
node scripts/setup-eslint.js --type non-workspace --force
```

### quick-switch.js

```bash
# 切换到非 Workspace
node scripts/quick-switch.js non-workspace

# 切换到 Workspace
node scripts/quick-switch.js workspace

# 强制切换
node scripts/quick-switch.js workspace --force
```

## 📖 详细文档

### 非 Workspace 配置

**参考**: `references/non-workspace-config.md`

**内容**:
- 完整配置选项
- React/Vue/Node.js 示例
- 自定义规则
- 故障排除

### Workspace 配置

**参考**: `references/workspace-config.md`

**内容**:
- 包结构设计
- 构建流程
- 发布指南
- 子项目集成

### 配置对比

**参考**: `references/comparison.md`

**内容**:
- 详细对比表
- 决策树
- 迁移指南
- 最佳实践

## 🎯 质量标准

### 配置要求

✅ **所有配置必须**:
- 使用 ESLint v9 平面配置
- 2 空格缩进
- 单引号
- 无分号
- 尾随逗号

### 验证步骤

```bash
# 1. 检查配置文件
ls eslint.config.js

# 2. 测试配置
npx eslint --print-config index.js

# 3. 运行检查
pnpm lint

# 4. 自动修复
pnpm lint:fix
```

## 🚨 常见问题

### Q: 我应该选择哪种配置？

**A**: 看项目数量
- 1-2 个项目 → 非 Workspace
- 3+ 个项目 → Workspace

### Q: 如何从旧配置迁移？

**A**: 参考 `references/comparison.md` 的迁移指南

### Q: Workspace 包如何更新？

**A**:
1. 修改 `packages/eslint-config/src/index.ts`
2. `pnpm build`
3. 子项目 `pnpm update @your-scope/eslint-config`

## 📦 资源文件说明

### scripts/setup-eslint.js

**功能**:
- 自动检测项目类型
- 创建配置文件
- 安装依赖
- 验证配置

**使用**:
```javascript
// 非 Workspace
node setup-eslint.js --type non-workspace

// Workspace
node setup-eslint.js --type workspace --scope @yourcompany
```

### scripts/quick-switch.js

**功能**:
- 切换配置类型
- 备份现有配置
- 更新 package.json

**使用**:
```javascript
node quick-switch.js non-workspace  // 切换到非 Workspace
node quick-switch.js workspace      // 切换到 Workspace
```

### references/non-workspace-config.md

**包含**:
- 基础配置模板
- 框架变体 (React/Vue/Node.js)
- 自定义规则
- 故障排除

### references/workspace-config.md

**包含**:
- 包结构设计
- package.json 配置
- 构建流程
- 发布指南

### references/comparison.md

**包含**:
- 配置对比表
- 决策树
- 使用场景
- 迁移步骤

### assets/templates/eslint-config/

**包含**:
- `src/index.ts` - 主配置
- `package.json` - 包配置
- `tsdown.config.ts` - 构建配置
- `eslint.config.js` - 开发配置
- `README.md` - 包文档

## 🎓 学习路径

### 初学者
1. 阅读 `SKILL.md` 的 Quick Start
2. 选择非 Workspace 方案
3. 使用 `setup-eslint.js` 自动配置

### 进阶用户
1. 阅读 `references/comparison.md`
2. 理解两种方案的区别
3. 根据项目需求选择

### 团队领导
1. 阅读 `references/workspace-config.md`
2. 创建共享配置包
3. 在团队中推广使用

## 🔍 验证和测试

### 验证 Skill 结构

```bash
# 使用 skill-creator 验证
python3 .claude/skills/skill-creator/scripts/quick_validate.py frontend/skills/eslint-config
```

### 打包 Skill

```bash
# 生成 zip 文件
python3 .claude/skills/skill-creator/scripts/package_skill.py frontend/skills/eslint-config
```

### 测试使用

```bash
# 在 Claude Code 中测试
@frontend/eslint-config I need to configure ESLint for my project
```

## 📞 获取帮助

### Skill 内部
- **主文档**: `SKILL.md`
- **详细指南**: `references/`
- **脚本帮助**: `node scripts/setup-eslint.js --help`

### 外部资源
- [Antfu ESLint Config](https://github.com/antfu/eslint-config)
- [ESLint v9 文档](https://eslint.org/docs/latest/)
- [Flat Config 指南](https://eslint.org/docs/latest/use/configure/configuration-files-new)

## ✅ 检查清单

**Skill 完整性检查**:
- [x] SKILL.md 存在且符合规范
- [x] YAML frontmatter 正确
- [x] 使用 imperative 语言
- [x] 包含 WHEN to use
- [x] scripts/ 目录包含可执行脚本
- [x] references/ 目录包含详细文档
- [x] assets/ 目录包含模板文件
- [x] 所有文件使用英文命名
- [x] 验证通过
- [x] 打包成功

**使用前检查**:
- [ ] 理解非 Workspace 和 Workspace 的区别
- [ ] 确定项目类型
- [ ] 准备好运行脚本
- [ ] 了解基本的 ESLint 概念

---

**总结**: 这是一个完整的、符合 skill-creator 规范的 ESLint 配置技能，提供了从简单到复杂的完整解决方案。

**开始使用**: 在 Claude Code 中输入 `@frontend/eslint-config` 并描述你的需求！