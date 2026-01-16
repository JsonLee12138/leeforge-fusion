# Leeforge Fusion Documentation

> Complete documentation for Leeforge Fusion framework.

## 🌍 Multi-Language Support

This documentation supports multiple languages:

- **🇺🇸 English** (default) - `/en/`
- **🇨🇳 中文** (Chinese) - `/zh/`

### Language Detection

The documentation automatically detects the preferred language:

1. **URL Path**: `/en/` or `/zh/`
2. **Browser Language**: From `navigator.language`
3. **Default**: English (`/en/`)

### Language Switcher

Add a language switcher to your documentation site:

```tsx
// LanguageSwitcher.tsx
export function LanguageSwitcher() {
  const currentLang = getCurrentLanguage();

  return (
    <div class="language-switcher">
      <a href="/en/" class={currentLang === "en" ? "active" : ""}>
        🇺🇸 English
      </a>
      <a href="/zh/" class={currentLang === "zh" ? "active" : ""}>
        🇨🇳 中文
      </a>
    </div>
  );
}
```

## 📁 Directory Structure

```
apps/docs/
├── en/                    # English documentation
│   ├── index.md
│   ├── quick-start.md
│   ├── core-concepts.md
│   ├── cli.md
│   ├── api.md
│   └── examples.md
├── zh/                    # Chinese documentation
│   ├── index.md
│   ├── quick-start.md
│   ├── core-concepts.md
│   ├── cli.md
│   ├── api.md
│   └── examples.md
├── languages.json         # Language configuration
└── README.md              # This file
```

## 🚀 Quick Start

### English

```bash
# View English documentation
open http://localhost:3000/en/
```

### 中文

```bash
# 查看中文文档
open http://localhost:3000/zh/
```

## 📄 Documentation Files

### English (🇺🇸)

| Page                               | Description                     |
| ---------------------------------- | ------------------------------- |
| [Home](/en/)                       | Framework overview and features |
| [Quick Start](/en/quick-start)     | 5-minute getting started guide  |
| [Core Concepts](/en/core-concepts) | Architecture and concepts       |
| [CLI Reference](/en/cli)           | Command-line interface          |
| [API Reference](/en/api)           | Complete API documentation      |
| [Examples](/en/examples)           | Real-world examples             |

### 中文 (🇨🇳)

| 页面                          | 描述           |
| ----------------------------- | -------------- |
| [首页](/zh/)                  | 框架概述和特性 |
| [快速开始](/zh/quick-start)   | 5分钟入门指南  |
| [核心概念](/zh/core-concepts) | 架构和概念     |
| [CLI 参考](/zh/cli)           | 命令行接口     |
| [API 参考](/zh/api)           | 完整 API 文档  |
| [示例](/zh/examples)          | 实际案例       |

## 🎯 Contributing

### Adding a New Language

1. Create a new directory: `apps/docs/[lang-code]/`
2. Copy all files from `en/` to the new directory
3. Translate the content
4. Update `languages.json`:

```json
{
  "supported": [
    {
      "code": "es",
      "name": "Spanish",
      "nativeName": "Español",
      "flag": "🇪🇸"
    }
  ]
}
```

### Updating Documentation

When updating documentation:

1. Update the English version first (`en/`)
2. Then update other language versions
3. Keep translations in sync

### Translation Guidelines

- **Consistency**: Use consistent terminology
- **Clarity**: Prioritize clarity over literal translation
- **Cultural**: Adapt examples for the target culture
- **Technical**: Keep technical terms in English when appropriate

## 🔗 Navigation

### English

- [Home](/en/)
- [Quick Start](/en/quick-start)
- [Core Concepts](/en/core-concepts)
- [CLI Reference](/en/cli)
- [API Reference](/en/api)
- [Examples](/en/examples)

### 中文

- [首页](/zh/)
- [快速开始](/zh/quick-start)
- [核心概念](/zh/core-concepts)
- [CLI 参考](/zh/cli)
- [API 参考](/zh/api)
- [示例](/zh/examples)

## 🛠️ Build & Deploy

### Local Development

```bash
cd apps/docs
npm run dev
```

### Build for Production

```bash
cd apps/docs
npm run build
```

### Deploy

```bash
# Deploy to Vercel
cd apps/docs
vercel

# Deploy to Netlify
cd apps/docs
netlify deploy --prod
```

## 📊 Language Statistics

| Language   | Status         | Progress |
| ---------- | -------------- | -------- |
| 🇺🇸 English | ✅ Complete    | 100%     |
| 🇨🇳 中文    | 🚧 In Progress | 90%      |

## 🤝 Contributing

We welcome contributions to translate documentation into more languages!

1. Fork the repository
2. Create a new branch: `docs/[language]`
3. Add translations
4. Submit a Pull Request

## 📞 Support

- **GitHub Issues**: https://github.com/JsonLee12138/leeforge-fusion/issues
- **Discussions**: https://github.com/JsonLee12138/leeforge-fusion/discussions

---

**Built with ❤️ using Leeforge Fusion**
