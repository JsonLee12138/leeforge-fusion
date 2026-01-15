# Leeforge CLI

Command-line interface for Leeforge Fusion framework.

## Installation

```bash
npm install -g @leeforge/cli
```

Or use with npx:

```bash
npx @leeforge/cli <command>
```

## Commands

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

Create `framework.config.ts` in your project root:

```typescript
import { defineConfig } from "@leeforge/fusion/config";
import { requireAuth } from "@leeforge/fusion/middleware";

export default defineConfig({
  guards: {
    "/admin/*": [requireAuth()],
  },
  api: {
    prefix: "/api",
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
