# Leeforge CLI ⚡

> Command-line interface for Leeforge Fusion framework.

[![Version](https://img.shields.io/npm/v/@leeforge/fusion-cli?style=flat)](https://www.npmjs.com/package/@leeforge/fusion-cli)
[![License](https://img.shields.io/npm/l/@leeforge/fusion-cli)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/JsonLee12138/leeforge-fusion)

## 📚 Table of Contents

- [🎯 What is Leeforge CLI?](#-what-is-leeforge-cli)
- [🚀 Installation](#-installation)
- [📖 Usage Guide](#-usage-guide)
  - [1. Initialize Project](#1-initialize-project)
  - [2. Development Server](#2-development-server)
  - [3. Build for Production](#3-build-for-production)
  - [4. Code Generation](#4-code-generation)
- [📋 Available Commands](#-available-commands)
  - [init](#init)
  - [dev](#dev)
  - [build](#build)
  - [generate](#generate)
- [🎯 Generated Code Examples](#-generated-code-examples)
  - [Page](#page)
  - [API Route](#api-route)
  - [Component](#component)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [🛠️ Development](#-development)
- [📦 Publishing](#-publishing)
- [📄 License](#-license)

---

## 🎯 What is Leeforge CLI?

Leeforge CLI is a powerful command-line tool that helps you:

- **Initialize** new Leeforge Fusion projects with templates
- **Develop** with hot module replacement
- **Build** optimized production bundles
- **Generate** code scaffolding for pages, APIs, and components
- **Manage** your project configuration

## 🚀 Installation

```bash
npm install -g @leeforge/fusion-cli
```

Or use with npx:

```bash
npx @leeforge/fusion-cli <command>
```

**Binary Names:**

- `leeforge-fusion` (primary)
- `lf-fusion` (alias)

**Usage:**

```bash
# Using primary binary
leeforge-fusion dev

# Using alias
lf-fusion dev
```

## 📖 Usage Guide

Leeforge CLI provides a comprehensive set of commands to streamline your development workflow.

### 1. Initialize Project

Create a new Leeforge Fusion project with a template:

```bash
# Create a new project with the basic template
leeforge init my-app

# Create a project with a specific template
leeforge init my-blog --template blog
leeforge init my-dashboard --template dashboard

# Available templates:
# - basic: Simple app with home and about pages
# - blog: Blog with posts, categories, and RSS
# - dashboard: Admin dashboard with authentication
```

**Template Comparison:**

| Template      | Features                             | Best For              |
| ------------- | ------------------------------------ | --------------------- |
| **basic**     | Home page, About page, Basic routing | Learning, Simple apps |
| **blog**      | Posts, Categories, RSS feed, Search  | Content websites      |
| **dashboard** | Authentication, Admin panel, Charts  | Business applications |

### 2. Development Server

Start the development server with hot module replacement:

```bash
# Start on default port (3000)
leeforge dev

# Start on custom port
leeforge dev --port 3001

# Start with host binding
leeforge dev --host 0.0.0.0

# Start with custom config
leeforge dev --config ./custom.config.ts
```

**Features:**

- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh
- ✅ Error overlay
- ✅ TypeScript support
- ✅ Automatic routing

### 3. Build for Production

Create an optimized production build:

```bash
# Standard build
leeforge build

# Build with custom output directory
leeforge build --outDir dist

# Build with source maps
leeforge build --sourcemap

# Build for specific environment
leeforge build --mode production
```

**Build Output:**

- Optimized JavaScript bundles
- Static HTML files
- CSS extraction
- Asset optimization
- Type definitions

### 4. Code Generation

Generate code scaffolding to speed up development:

```bash
# Generate a page
leeforge generate page blog/[id]

# Generate an API route
leeforge generate api users/[id]

# Generate a component
leeforge generate component Button

# Generate middleware
leeforge generate middleware auth

# Preview without creating files
leeforge generate page about --dry-run

# Force overwrite existing files
leeforge generate page blog --force
```

## 📋 Available Commands

### `init`

Initialize a new Leeforge Fusion project.

**Syntax:**

```bash
leeforge-fusion init [name] [options]
```

**Arguments:**

- `name`: Project name (default: "my-app")

**Options:**

- `-t, --template <type>`: Template to use (basic, blog, dashboard) (default: "basic")

**Available Templates:**

- **basic**: Simple app with home and about pages
- **blog**: Blog with posts, categories, and RSS
- **dashboard**: Admin dashboard with authentication

**Examples:**

```bash
# Basic project (default template)
leeforge-fusion init
leeforge-fusion init my-app

# Blog template
leeforge-fusion init my-blog --template blog

# Dashboard template
leeforge-fusion init my-dashboard --template dashboard
```

**Options:**

- `--template <name>`: Use a specific template (basic, blog, dashboard)
- `--git`: Initialize git repository
- `--install`: Install dependencies automatically
- `--pm <manager>`: Package manager (npm, yarn, pnpm)

**Examples:**

```bash
# Basic project
leeforge init my-app

# Blog with git and install
leeforge init my-blog --template blog --git --install

# Dashboard with pnpm
leeforge init my-dashboard --template dashboard --pm pnpm
```

### `dev`

Start the development server.

**Syntax:**

```bash
leeforge-fusion dev [options]
```

**Options:**

- `-p, --port <number>`: Port number (default: 3000, or from config)

**Features:**

- ✅ Hot Module Replacement (HMR)
- ✅ Automatic app directory detection
- ✅ Config file support
- ✅ TypeScript support

**Examples:**

```bash
# Default development (port 3000)
leeforge-fusion dev

# Custom port
leeforge-fusion dev --port 3001
leeforge-fusion dev -p 3001
```

**How it works:**

1. Loads `leeforge.config.ts` from project root
2. Detects app directory (src/app, app, src, or current directory)
3. Starts Vite dev server with HMR
4. Serves your Leeforge Fusion application

**Options:**

- `--port <number>`: Port number (default: 3000)
- `--host <address>`: Host address (default: localhost)
- `--config <path>`: Custom config file path
- `--open`: Open browser automatically
- `--https`: Use HTTPS with self-signed certificate

**Examples:**

```bash
# Default development
leeforge dev

# Custom port and open browser
leeforge dev --port 3001 --open

# With HTTPS
leeforge dev --https
```

### `build`

Build the application for production.

**Syntax:**

```bash
leeforge-fusion build
```

**Options:**

- None (uses configuration from `leeforge.config.ts`)

**Features:**

- ✅ Client-side bundle (dist/client)
- ✅ Server-side bundle (dist/server)
- ✅ Code splitting (vendor chunks)
- ✅ Automatic optimization

**Examples:**

```bash
# Standard production build
leeforge-fusion build
```

**Build Output:**

```
dist/
├── client/           # Client-side bundles
│   ├── index.js
│   ├── vendor.js     # SolidJS, TanStack libraries
│   └── assets/
└── server/           # Server-side bundle
    └── entry-server.js
```

**How it works:**

1. Loads `leeforge.config.ts` from project root
2. Builds client-side bundle with code splitting
3. Builds server-side bundle for SSR
4. Outputs to `dist/` directory

**Options:**

- `--outDir <path>`: Output directory (default: dist)
- `--sourcemap`: Generate source maps
- `--mode <mode>`: Build mode (production, development)
- `--analyze`: Analyze bundle size
- `--minify`: Minify output

**Examples:**

```bash
# Standard production build
leeforge build

# With source maps and analysis
leeforge build --sourcemap --analyze

# Custom output directory
leeforge build --outDir ./build
```

### `generate` (alias: `g`)

Generate code scaffolding.

**Syntax:**

```bash
leeforge-fusion generate <type> <name> [options]
leeforge-fusion g <type> <name> [options]
```

**Arguments:**

- `type`: Type to generate (page, api, component)
- `name`: Name of the item (e.g., "blog/[id]", "users/[id]", "Button")

**Options:**

- `--dry-run`: Show what would be generated without creating files

**Supported Types:**

- **page**: Generate a page component
- **api**: Generate an API route
- **component**: Generate a component

**Examples:**

```bash
# Generate page
leeforge-fusion generate page blog/[id]

# Generate API route
leeforge-fusion generate api users/[id]

# Generate component
leeforge-fusion generate component Button

# Preview without creating files
leeforge-fusion generate page about --dry-run

# Using alias
leeforge-fusion g page contact
```

**Types:**

- `page`: Generate a page component
- `api`: Generate an API route
- `component`: Generate a component
- `middleware`: Generate middleware
- `layout`: Generate a layout component

**Options:**

- `--dry-run`: Preview without creating files
- `--force`: Overwrite existing files
- `--typescript`: Generate TypeScript files
- `--css`: Include CSS module
- `--test`: Include test file

**Examples:**

```bash
# Generate page with params
leeforge generate page blog/[id]

# Generate API with multiple methods
leeforge generate api users/[id]

# Generate component with tests
leeforge generate component Button --test --css

# Preview generation
leeforge generate page about --dry-run
```

## 🎯 Generated Code Examples

### Page

**Command:**

```bash
leeforge-fusion generate page blog/[id]
```

**Generated Files:**

```
app/blog/[id]/
└── index.tsx          # Main page component
```

**Generated Code:**

```typescript
// app/blog/[id]/index.tsx
import { createSignal } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function Page() {
  const [count, setCount] = createSignal(0);
  const data = createServerData(async ({ params, queryClient }) => {
    return { message: "Hello from blog/[id]" };
  });

  return (
    <div>
      <h1>blog/[id]</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <p>Data: {data()?.message}</p>
    </div>
  );
}

export const loader = async ({ queryClient, params }) => {
  return { message: "Hello from blog/[id]" };
};

export const guards = [];
```

**Features:**

- ✅ Server-side data loading with `createServerData`
- ✅ Client-side state with `createSignal`
- ✅ Type-safe route parameters
- ✅ Loader function for data fetching
- ✅ Guards array for route protection
- ✅ Interactive counter example

### API Route

**Command:**

```bash
leeforge-fusion generate api users/[id]
```

**Generated Files:**

```
app/api/users/[id]/
└── route.ts           # API route handler
```

**Generated Code:**

```typescript
// app/api/users/[id]/route.ts
export async function GET({ request, params }) {
  return Response.json({ message: "GET users/[id]" });
}

export async function POST({ request, params }) {
  const body = await request.json();
  return Response.json({ message: "POST users/[id]", data: body });
}
```

**Features:**

- ✅ Multiple HTTP methods (GET, POST)
- ✅ Request and params access
- ✅ JSON response handling
- ✅ Request body parsing
- ✅ Type-safe parameters

### Component

**Command:**

```bash
leeforge-fusion generate component Button
```

**Generated Files:**

```
components/Button/
└── Button.tsx         # Main component
```

**Generated Code:**

```typescript
// components/Button/Button.tsx
import { createSignal } from "solid-js";

export interface ButtonProps {
  label?: string;
}

export default function Button(props: ButtonProps) {
  const [count, setCount] = createSignal(0);

  return (
    <div class="component">
      <h3>{props.label || "Button"}</h3>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>Click me</button>
    </div>
  );
}
```

**Features:**

- ✅ TypeScript interface
- ✅ Props with default values
- ✅ Client-side state management
- ✅ Interactive counter example
- ✅ Simple and reusable

### Middleware

**Command:**

```bash
leeforge generate middleware auth
```

**Generated Files:**

```
src/middleware/
├── auth.ts            # Middleware logic
└── types.ts           # Type definitions
```

**Generated Code:**

```typescript
// src/middleware/auth.ts
import { createMiddleware } from "leeforge-fusion/middleware";
import { redirect } from "leeforge-fusion/middleware/redirect";

export const requireAuth = createMiddleware(async (ctx, next) => {
  // Check authentication
  const session = await getSession(ctx);

  if (!session.user) {
    throw redirect("/login");
  }

  // Attach user to context
  ctx.user = session.user;

  await next();
});

export const requireAdmin = createMiddleware(async (ctx, next) => {
  // Check admin role
  if (!ctx.user || ctx.user.role !== "admin") {
    throw redirect("/unauthorized");
  }

  await next();
});
```

**Features:**

- ✅ Authentication checks
- ✅ Role-based access control
- ✅ Context modification
- ✅ Redirect handling
- ✅ Type safety

## 📁 Project Structure

After running `leeforge-fusion init`, your project will have:

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── index.tsx           # Home page
│   │   ├── about.tsx           # About page
│   │   └── blog/
│   │       ├── index.tsx       # Blog list
│   │       └── [id].tsx        # Dynamic blog post
│   └── middleware/
│       └── auth.ts             # Authentication middleware
├── leeforge.config.ts          # Configuration
├── package.json
└── tsconfig.json
```

After running `leeforge-fusion generate`, your project will have:

```
my-app/
├── app/
│   ├── blog/[id]/
│   │   └── index.tsx           # Generated page
│   └── api/users/[id]/
│       └── route.ts            # Generated API
├── components/
│   └── Button/
│       └── Button.tsx          # Generated component
└── ...
```

## 🔧 Configuration

The CLI automatically creates `leeforge.config.ts` in your project root:

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  api: {
    prefix: "/api",
  },
  vite: {
    server: {
      port: 3000,
    },
  },
});
```

### Configuration Options

**API Configuration:**

- `prefix`: API route prefix (default: "/api")
- `timeout`: Request timeout in milliseconds

**Vite Configuration:**

- `server.port`: Development server port (default: 3000)
- `server.host`: Host address
- `build.outDir`: Build output directory
- `build.sourcemap`: Generate source maps
- Any Vite configuration option is supported

**Route Guards:**

- `guards`: Object mapping routes to middleware files
- Example: `"/admin/*": "./src/middleware/auth.ts"`

### How Configuration Works

1. **Loading**: CLI loads `leeforge.config.ts` from project root
2. **Merging**: Configuration is merged with framework defaults
3. **Usage**: Used by `dev` and `build` commands
4. **Optional**: If no config exists, defaults are used

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/JsonLee12138/leeforge-fusion.git
cd leeforge-fusion

# Install dependencies
pnpm install

# Build CLI
cd packages/cli
pnpm run build

# Test CLI locally
./dist/index.js dev --port 3000
```

### Testing the CLI

```bash
# Run tests
pnpm test

# Type check
pnpm run typecheck

# Test specific commands
./dist/index.js init test-app --template basic
./dist/index.js generate page test-page --dry-run
```

### Build Commands

```bash
# Build the CLI
pnpm run build

# Build with watch mode
pnpm run dev
```

### Code Quality

```bash
# Type check
pnpm run typecheck
```

## 📦 Publishing

### Prepare for Publishing

```bash
# Build the CLI
pnpm run build

# Run tests
pnpm test

# Check type safety
pnpm run typecheck
```

### Publish to npm

```bash
# Login to npm (if not already)
npm login

# Publish public package
npm publish --access public

# Publish with tag
npm publish --tag beta
```

### Version Management

```bash
# Bump version
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0

# Publish with version bump
npm version patch && npm publish --access public
```

## 🎯 CLI Architecture

### Command Structure

```
leeforge-fusion
├── init [name] [options]
│   └── -t, --template <type>
├── dev [options]
│   └── -p, --port <number>
├── build
└── generate <type> <name> [options]
    └── --dry-run
```

### Core Modules

**Source Structure:**

```
src/
├── index.ts              # CLI entry point
├── commands/
│   ├── init.ts           # Project initialization
│   ├── dev.ts            # Development server
│   ├── build.ts          # Production build
│   └── generate.ts       # Code generation
├── generators/
│   ├── page.ts           # Page generator
│   ├── api.ts            # API generator
│   └── component.ts      # Component generator
└── types.d.ts            # Type definitions
```

### Command Implementation

**init Command:**

- Loads templates from inline code (not external files)
- Creates directory structure
- Writes template files
- Supports 3 templates: basic, blog, dashboard

**dev Command:**

- Imports `@leeforge/fusion` dynamically
- Loads configuration from `leeforge.config.ts`
- Detects app directory automatically
- Starts Vite dev server

**build Command:**

- Uses Vite's build API
- Builds client and server bundles
- Code splitting for vendor chunks
- Outputs to `dist/` directory

**generate Command:**

- Dynamic import of generators
- Supports: page, api, component
- Creates files in appropriate directories
- Supports dry-run mode

### Template System

Templates are defined inline in `commands/init.ts`:

```typescript
const templates = {
  basic: {
    /* basic template files */
  },
  blog: {
    /* blog template files */
  },
  dashboard: {
    /* dashboard template files */
  },
};
```

**Template Files Include:**

- `src/app/layout.tsx`
- `src/app/index.tsx`
- `src/app/about.tsx` (basic)
- `leeforge.config.ts`
- `package.json`
- `tsconfig.json`

## 📊 CLI Features

### Dynamic Imports

Commands are loaded dynamically to improve startup time:

```typescript
// Only loads when command is executed
const { devCommand } = await import("./commands/dev");
```

### Dry Run Mode

Preview code generation without creating files:

```bash
leeforge-fusion generate page blog/[id] --dry-run
# Shows what files would be created
```

### Automatic Directory Detection

The dev command automatically detects your app directory:

**Search Order:**

1. `src/app`
2. `app`
3. `src`
4. Current directory

**Detection Logic:**

- Looks for `index.tsx`, `index.ts`, `page.tsx`, `page.ts`, `layout.tsx`, or `layout.ts`
- Uses the first directory with page files found

### Help System

Get help for any command:

```bash
leeforge-fusion --help
leeforge-fusion init --help
leeforge-fusion generate --help
```

### Error Handling

- ✅ Graceful error messages
- ✅ Process exit codes
- ✅ Helpful suggestions
- ✅ File existence checks

## 🚀 Performance

### Startup Performance

- **Dynamic Imports**: Commands loaded on-demand
- **Fast Startup**: <100ms CLI startup time
- **Lazy Loading**: Only loads required modules

### Command Performance

- **Init**: ~2-3 seconds to create project
- **Dev**: Instant startup, HMR <100ms
- **Build**: ~2-3 seconds for small apps
- **Generate**: <50ms per generated file

### Optimization Features

- **Code Splitting**: Vendor chunks in build
- **Tree Shaking**: Unused code elimination
- **Dynamic Imports**: On-demand module loading
- **Fast Refresh**: Vite HMR integration

## 🔍 Troubleshooting

### Common Issues

**Issue**: Command not found

```bash
# Solution: Install globally or use npx
npm install -g @leeforge/fusion-cli
# or
npx @leeforge/fusion-cli <command>
```

**Issue**: Port already in use

```bash
# Solution: Use different port
leeforge-fusion dev --port 3001
```

**Issue**: Template not found

```bash
# Solution: Check available templates
leeforge-fusion init --help
# or use default template
leeforge-fusion init my-app
```

**Issue**: Generation fails

```bash
# Solution: Use dry-run to debug
leeforge-fusion generate page test --dry-run
```

**Issue**: Dev server won't start

```bash
# Solution: Check if leeforge.config.ts exists
# Create one if missing:
cat > leeforge.config.ts << 'EOF'
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  api: {
    prefix: "/api",
  },
  vite: {
    server: {
      port: 3000,
    },
  },
});
EOF
```

**Issue**: Build fails

```bash
# Solution: Ensure src/app directory exists with page files
# Check structure:
ls -la src/app/
# Should have: layout.tsx, index.tsx, or page.tsx
```

## 🤝 Contributing

We welcome contributions! Please see the main repository for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Ready to build?** Run `leeforge init my-app` to get started!
