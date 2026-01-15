# Leeforge CLI Templates

This directory contains template strings used by the CLI generators.

## Templates Used

The CLI generates code from string templates embedded in the generator files:

- **Page Template** (`src/generators/page.ts`) - Creates page components with data loading
- **API Template** (`src/generators/api.ts`) - Creates API routes with HTTP methods
- **Component Template** (`src/generators/component.ts`) - Creates reusable components

## Usage

```bash
# Generate a page
leeforge generate page blog/[id]

# Generate an API route
leeforge generate api users/[id]

# Generate a component
leeforge generate component Button

# Preview (dry run)
leeforge generate page about --dry-run
```

## Generated Files

All generated files are created in the current working directory:

- Pages: `app/<route>/index.tsx`
- API: `app/api/<route>/route.ts`
- Components: `components/<Name>/<Name>.tsx`

## Customization

To customize templates, edit the template strings in:

- `src/generators/page.ts`
- `src/generators/api.ts`
- `src/generators/component.ts`

The templates are plain strings that get written to files, so you can modify them to match your preferred coding style.
