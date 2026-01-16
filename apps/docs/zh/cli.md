# CLI Reference

> Complete reference for the Leeforge Fusion CLI.

## Overview

The Leeforge Fusion CLI provides commands for development, building, and code generation.

```bash
leeforge [options] [command]
```

## Commands

### `leeforge dev`

Start the development server.

```bash
leeforge dev [options]
```

**Options:**

- `--port <number>` - Port to listen on (default: 3000)

**Features:**

- Auto port detection (if port is in use, tries next available port)
- Hot module replacement (HMR)
- Error overlay
- Route visualization

**Examples:**

```bash
# Start on default port 3000
leeforge dev

# Start on specific port
leeforge dev --port 8080

# Port 3000 is in use, server will auto-find available port
leeforge dev --port 3000
# Output: ⚠️  Port 3000 is in use, trying 3001...
#         🚀 Leeforge Dev Server running on http://localhost:3001
```

### `leeforge build`

Build the application for production.

```bash
leeforge build
```

**Output:**

- `dist/client/` - Client-side bundle (HTML, CSS, JS)
- `dist/server/` - Server-side bundle (SSR)

**Example:**

```bash
$ leeforge build
✅ Build completed successfully
📁 Output: dist/
  ├── client/
  │   ├── index.html
  │   ├── assets/
  │   └── ...
  └── server/
      ├── entry-server.js
      └── ...
```

### `leeforge preview`

Preview the production build.

```bash
leeforge preview
```

**Features:**

- Serves the production build
- Uses Node.js HTTP server
- Production-ready performance

### `leeforge generate`

Generate code scaffolding.

```bash
leeforge generate <type> <name> [options]
```

**Aliases:** `g`

**Types:**

- `page` - Generate a page component
- `api` - Generate an API route
- `component` - Generate a reusable component

**Options:**

- `--dry-run` - Preview what would be generated without creating files

**Examples:**

```bash
# Generate a page
leeforge generate page blog/[slug]

# Generate an API route
leeforge generate api users/[id]

# Generate a component
leeforge generate component Button

# Preview without creating files
leeforge generate page about --dry-run
```

## Generated Code

### Page Component

```bash
leeforge generate page blog/[slug]
```

**Creates:** `app/blog/[slug]/index.tsx`

```tsx
import { createSignal } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function Page() {
  const [count, setCount] = createSignal(0);
  const data = createServerData(async ({ params, queryClient }) => {
    return { message: "Hello from blog/[slug]" };
  });

  return (
    <div>
      <h1>blog/[slug]</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <p>Data: {data()?.message}</p>
    </div>
  );
}

export const loader = async ({ queryClient, params }) => {
  return { message: "Hello from blog/[slug]" };
};

export const guards = [];
```

### API Route

```bash
leeforge generate api users/[id]
```

**Creates:** `app/api/users/[id]/route.ts`

```tsx
export async function GET({ request, params }) {
  return Response.json({ message: "GET users/[id]" });
}

export async function POST({ request, params }) {
  const body = await request.json();
  return Response.json({ message: "POST users/[id]", data: body });
}
```

### Component

```bash
leeforge generate component Button
```

**Creates:** `components/Button/Button.tsx`

```tsx
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
      <button onClick={() => setCount((c) => c + 1)}>Click me</button>
    </div>
  );
}
```

## Command Options

### Global Options

```bash
leeforge --help     # Show help
leeforge --version  # Show version
```

### Dev Options

```bash
leeforge dev --port 3000  # Specify port
```

### Generate Options

```bash
leeforge generate page about --dry-run  # Preview without creating
```

## Examples

### Development Workflow

```bash
# 1. Start development server
leeforge dev --port 3000

# 2. Generate a page
leeforge generate page blog/[slug]

# 3. Generate an API route
leeforge generate api users/[id]

# 4. Generate a component
leeforge generate component Card

# 5. Build for production
leeforge build

# 6. Preview production build
leeforge preview
```

### Complete Project Setup

```bash
# Create project structure
mkdir my-app && cd my-app
mkdir -p src/app src/middleware

# Create files
touch src/app/layout.tsx
touch src/app/index.tsx
touch leeforge.config.ts

# Install dependencies
npm install @leeforge/fusion @leeforge/fusion-cli solid-js @tanstack/solid-router @tanstack/solid-query

# Start development
leeforge dev --port 3000
```

## Troubleshooting

### Port Already in Use

```bash
$ leeforge dev --port 3000
⚠️  Port 3000 is in use, trying 3001...
🚀 Leeforge Dev Server running on http://localhost:3001
```

The server automatically finds an available port.

### Command Not Found

Make sure the CLI is installed:

```bash
npm install -g @leeforge/fusion-cli
```

Or use npx:

```bash
npx leeforge dev --port 3000
```

### TypeScript Errors

Check your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 📚 Next Steps

- [Quick Start](/quick-start) - Get started in 5 minutes
- [Core Concepts](/core-concepts) - Understand the framework
- [API Reference](/api) - Complete API documentation
