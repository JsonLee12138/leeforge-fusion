# 模板文件目录

本目录包含各种项目配置和代码模板文件。

## 可用模板

### 1. Commitlint 配置模板
- **文件**: `commitlintrc.template.cjs`
- **用途**: Conventional Commits 规范配置
- **使用**: 复制到项目根目录并重命名为 `.commitlintrc.cjs`

### 2. ESLint 配置包模板
- **目录**: `eslint-config/`
- **用途**: Workspace/Monorepo 项目的共享 ESLint 配置包
- **使用**: 将整个目录复制到 `packages/eslint-config/`

#### ESLint 配置包结构
```
eslint-config/
├── package.json          # 包配置和依赖
├── src/
│   └── index.ts         # 主配置文件
├── eslint.config.js     # 本地开发配置
├── tsdown.config.ts     # 构建工具配置
├── README.md            # 使用说明
└── .gitignore           # 忽略文件
```

#### 快速开始

1. **复制模板**
   ```bash
   # 在 workspace 根目录
   cp -r frontend/templates/eslint-config packages/eslint-config
   ```

2. **修改包名**
   编辑 `packages/eslint-config/package.json`：
   ```json
   {
     "name": "@your-scope/eslint-config"
   }
   ```

3. **安装依赖**
   ```bash
   cd packages/eslint-config
   pnpm install
   ```

4. **构建**
   ```bash
   pnpm build
   ```

5. **在子项目中使用**
   ```bash
   # 在子项目中
   pnpm add -D @your-scope/eslint-config

   # 创建 eslint.config.js
   echo "import config from '@your-scope/eslint-config'\n\nexport default config({ typescript: true, react: true })" > eslint.config.js
   ```

## 模板使用原则

1. **文件命名**: 使用英文，遵循项目命名规范
2. **自定义配置**: 根据项目需求调整配置选项
3. **版本控制**: 建议将模板纳入版本管理
4. **文档更新**: 保持模板文档与实际配置同步

## 相关文档

- [前端开发规范](../standards.md) - 代码规范和最佳实践
- [项目结构](../standards.md#项目结构) - 推荐目录结构

## 贡献模板

如需添加新模板：

1. 在相应目录创建模板文件
2. 使用 `.template` 后缀或创建独立目录
3. 提供详细的使用说明
4. 更新本 README 文档