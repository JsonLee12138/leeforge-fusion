# Leeforge CLI

Command-line interface for Leeforge Fusion framework.

## Installation

```bash
npm install -g @leeforge/fusion-cli
```

Or use with npx:

```bash
npx @leeforge/fusion-cli <command>
```

## Commands

### `init`

Initialize a new Leeforge Fusion project.

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

### `dev`

Start the development server.

```bash
leeforge dev
leeforge dev --port 3000
```

### `build`

Build the application for production.

```bash
leeforge build
```

### `generate` (alias: `g`)

Generate code scaffolding.

```bash
# Generate a page
leeforge generate page blog/[id]

# Generate an API route
leeforge generate api users/[id]

# Generate a component
leeforge generate component Button

# Preview without creating files
leeforge generate page about --dry-run
```

## Generated Code Examples

### Page

```bash
leeforge generate page blog/[id]
```

Creates `app/blog/[id]/index.tsx` with:

- Server-side data loading
- Interactive counter
- Type-safe params

### API Route

```bash
leeforge generate api users/[id]
```

Creates `app/api/users/[id]/route.ts` with:

- GET handler
- POST handler
- Request body parsing

### Component

```bash
leeforge generate component Button
```

Creates `components/Button/Button.tsx` with:

- Props interface
- State management
- Interactive example

## Project Structure

After running `leeforge generate`, your project will have:

```
src/
├── app/
│   ├── layout.tsx
│   ├── index.tsx
│   ├── blog/
│   │   ├── [id]/
│   │   │   └── index.tsx
│   │   └── index.tsx
│   └── api/
│       └── users/
│           └── [id]/
│               └── route.ts
├── components/
│   └── Button/
│       └── Button.tsx
└── middleware/
    └── auth.ts
```

## Configuration

Create `leeforge.config.ts` in your project root:

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  guards: {
    "/admin/*": "./src/middleware/auth.ts",
  },
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

## Development

```bash
# Install dependencies
pnpm install

# Build CLI
cd packages/cli
pnpm run build

# Test CLI
./dist/index.js dev --port 3000
```

## Publishing

```bash
# Build the CLI
pnpm run build

# Publish to npm
npm publish --access public
```

## License

MIT
