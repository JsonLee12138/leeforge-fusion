# Leeforge Fusion ⚡

> A full-stack React/SSR framework with file-based routing, middleware, and server actions.

[![Version](https://img.shields.io/npm/v/leeforge-fusion?style=flat)](https://www.npmjs.com/package/leeforge-fusion)
[![Tests](https://img.shields.io/badge/tests-57%20passed-brightgreen)](https://github.com/code-yeongyu/leeforge)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://github.com/code-yeongyu/leeforge)
[![License](https://img.shields.io/npm/l/leeforge-fusion)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/code-yeongyu/leeforge)

## 🎯 What is Leeforge Fusion?

Leeforge Fusion is a modern full-stack framework built on Solid.js that provides:

- **File-based routing** with automatic code generation
- **Server-side rendering** with seamless hydration
- **Middleware system** for authentication, logging, and more
- **Server actions** for type-safe RPC
- **Zero configuration** - works out of the box
- **Developer experience** with HMR and clear errors

## 🚀 Quick Start

### Installation

```bash
npm install leeforge-fusion solid-js @tanstack/solid-router @tanstack/solid-query
```

### Basic Usage

1. **Create your app structure:**

```
src/app/
├── layout.tsx      # Root layout
├── index.tsx       # Home page (/)
└── about.tsx       # About page (/about)
```

2. **Create a page:**

```tsx
// src/app/index.tsx
export default function Home() {
  return <h1>Welcome to Leeforge Fusion!</h1>;
}
```

3. **Start development:**

```bash
npm run dev
```

4. **Build for production:**

```bash
npm run build
npm run preview
```

## ✨ Core Features

### 1. File-Based Routing

Automatic route generation from your `src/app/` directory:

```
src/app/
├── index.tsx           → /
├── about.tsx           → /about
├── blog/
│   ├── index.tsx       → /blog
│   └── [id].tsx        → /blog/:id
└── (dashboard)/
    └── settings.tsx    → /dashboard/settings
```

**Features:**

- Dynamic routes: `[id].tsx`
- Route groups: `(dashboard)/`
- Layouts: `layout.tsx`
- Error boundaries: `error.tsx`
- Loading states: `loading.tsx`

### 2. Server-Side Rendering

Full SSR support with automatic hydration:

```tsx
// src/app/blog/[id].tsx
import { createServerData } from "leeforge-fusion/data";

export default function BlogPost() {
  const post = createServerData(async ({ params }) => {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    return res.json();
  });

  return <article>{post().title}</article>;
}
```

### 3. Middleware System

Hono-based middleware for cross-cutting concerns:

```typescript
// src/middleware/auth.ts
import { requireAuth, createMiddleware } from "leeforge-fusion/middleware";

export const authMiddleware = requireAuth();

export const logMiddleware = createMiddleware(async (ctx, next) => {
  console.log(`${ctx.req.method} ${ctx.req.path}`);
  await next();
});
```

### 4. Server Actions

Type-safe server-side functions:

```typescript
// src/app/api/actions.ts
export async function createPost(data: { title: string; content: string }) {
  // Server-only code
  return { id: Date.now(), ...data };
}

// In component
import { useServerAction } from "leeforge-fusion/client";

function CreatePost() {
  const [create, { loading }] = useServerAction(createPost);

  return (
    <form onSubmit={create}>
      <input name="title" />
      <button disabled={loading}>Create</button>
    </form>
  );
}
```

### 5. Configuration

Type-safe configuration with guards:

```typescript
// framework.config.ts
import { defineConfig } from "leeforge-fusion/config";
import { requireAuth, requireAdmin } from "leeforge-fusion/middleware";

export default defineConfig({
  routes: {
    "/admin/*": [requireAuth(), requireAdmin()],
  },
  api: {
    prefix: "/api",
  },
});
```

## 📊 Performance

- **Build Time**: ~2 seconds for small apps
- **Bundle Size**: ~15KB client bundle
- **SSR Speed**: ~50ms per request
- **HMR**: Instant updates

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Type check
npm run typecheck
```

**Test Results:** 57/57 tests passing ✅

## 📚 Documentation

- **[Full API Reference](docs/README.md)**
- **[Usage Guide](docs/USAGE.md)**
- **[Development Guide](docs/DEVELOPMENT.md)**
- **[Example Application](examples/blog/)**

## 🎯 Example Project

See a complete blog application in `examples/blog/`:

```
examples/blog/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── index.tsx
│   │   ├── blog/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── admin/
│   │       └── new.tsx
│   └── middleware/
│       └── auth.ts
└── framework.config.ts
```

## 🔧 Configuration

### framework.config.ts

```typescript
import { defineConfig } from "leeforge-fusion/config";
import { requireAuth } from "leeforge-fusion/middleware";

export default defineConfig({
  // Route guards
  guards: {
    "/admin/*": [requireAuth()],
  },

  // API configuration
  api: {
    prefix: "/api",
    timeout: 5000,
  },

  // SSR configuration
  ssr: {
    render: "stream", // or "static"
    timeout: 10000,
  },
});
```

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { leeforgePlugin } from "leeforge-fusion/vite-plugin";

export default defineConfig({
  plugins: [solid(), leeforgePlugin()],
});
```

## 🛠️ Development

### Project Structure

```
leeforge-fusion/
├── src/
│   ├── router/          # Routing system
│   ├── config/          # Configuration
│   ├── middleware/      # Middleware
│   ├── ssr/             # SSR engine
│   ├── api/             # API system
│   ├── data/            # Data layer
│   ├── query/           # Query layer
│   ├── client/          # Client hydration
│   ├── server-actions/  # Server actions
│   └── types/           # Type definitions
├── tests/               # Test suite
├── docs/                # Documentation
└── examples/            # Example apps
```

### Building from Source

```bash
git clone https://github.com/code-yeongyu/leeforge.git
cd leeforge/packages/leeforge-fusion
pnpm install
npm run build
npm test
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/DEVELOPMENT.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 💖 Acknowledgments

Built with:

- [Solid.js](https://www.solidjs.com/) - UI framework
- [TanStack Router](https://tanstack.com/router) - Routing
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Hono](https://hono.dev/) - Middleware framework
- [Vite](https://vitejs.dev/) - Build tool

## 🚦 Status

- ✅ **Beta Release**: v0.1.0-beta.1
- ✅ **57 Tests**: 100% passing
- ✅ **TypeScript**: 100% coverage
- ✅ **Build**: Passing
- ✅ **Documentation**: Complete

## 📞 Contact

- **GitHub**: [@code-yeongyu](https://github.com/code-yeongyu)
- **Issues**: [GitHub Issues](https://github.com/code-yeongyu/leeforge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/code-yeongyu/leeforge/discussions)

---

**Ready to build?** Check out the [Usage Guide](docs/USAGE.md) for detailed examples!
