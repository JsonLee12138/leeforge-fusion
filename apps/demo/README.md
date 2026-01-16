# Leeforge Fusion Demo App

A complete demonstration of the Leeforge Fusion framework capabilities.

## Features Demonstrated

### 1. File-Based Routing

- **Home Page** (`/`) - Main landing page with interactive counter
- **About Page** (`/about`) - Framework information
- **Blog** (`/blog`) - Dynamic routing with `[id]`
- **Blog New** (`/blog/new`) - Server actions demonstration
- **Dashboard** (`/dashboard`) - Protected route requiring auth
- **Admin** (`/admin`) - Route guards (requires admin role)

### 2. API Routes

- **GET /api/users** - Fetch user list
- **POST /api/users** - Create user
- **GET /api/posts** - Fetch posts
- **POST /api/posts** - Create post

### 3. Middleware

- **Auth Middleware** (`src/middleware/auth.ts`)
  - `requireAuth()` - Requires authentication token
  - `requireAdmin()` - Requires admin role

### 4. Server-Side Rendering

- All pages use `createServerData` for data fetching
- Automatic hydration on client
- Streaming support

### 5. Server Actions

- `createPost` action in `/blog/new`
- Type-safe RPC between client and server

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── index.tsx           # Home page
│   ├── about.tsx           # About page
│   ├── error.tsx           # Error boundary
│   ├── loading.tsx         # Loading state
│   ├── blog/
│   │   ├── index.tsx       # Blog list
│   │   ├── [id].tsx        # Blog post (dynamic)
│   │   └── new.tsx         # New post (server actions)
│   ├── dashboard/
│   │   └── index.tsx       # Dashboard (protected)
│   ├── admin/
│   │   ├── index.tsx       # Admin panel (admin only)
│   │   └── guards.ts       # Route guards
│   └── api/
│       ├── users/
│       │   └── route.ts    # Users API
│       └── posts/
│           └── route.ts    # Posts API
├── middleware/
│   └── auth.ts             # Authentication middleware
└── entry-server.tsx        # Server entry point
```

## Configuration

### leeforge.config.ts

```typescript
import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  guards: {
    "/dashboard/*": "./src/middleware/auth.ts",
    "/admin/*": "./src/middleware/auth.ts",
  },
  api: {
    prefix: "/api",
  },
  vite: {
    server: {
      port: 3000,
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  },
});
```

## Running the Demo

### Development

```bash
cd /Users/jsonlee/Projects/leeforge/apps/demo-app
pnpm install
pnpm run dev
```

### Production Build

```bash
pnpm run build
pnpm run preview
```

## Key Code Examples

### 1. Dynamic Route with Data Loading

```tsx
// src/app/blog/[id].tsx
export default function BlogPost() {
  const post = createServerData(async ({ params }) => {
    return await fetchPost(params.id);
  });

  return <article>{post().title}</article>;
}
```

### 2. Server Action

```tsx
// src/app/blog/new.tsx
export async function createPost(data) {
  return { id: Date.now(), ...data };
}

export default function NewPost() {
  const [create] = useServerAction(createPost);
  // ...
}
```

### 3. Route Guards

```typescript
// src/middleware/auth.ts
export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await next();
});
```

### 4. API Route

```typescript
// src/app/api/users/route.ts
export async function GET({ request, params }) {
  return Response.json({ users: [...] });
}
```

## Testing the Demo

### 1. Basic Navigation

- Visit `/` and click around
- Try `/blog/1`, `/blog/2`, etc.
- Test `/blog/new` form submission

### 2. Protected Routes

- Visit `/dashboard` - should work with auth
- Visit `/admin` - requires admin role

### 3. API Endpoints

```bash
curl http://localhost:3000/api/users
curl http://localhost:3000/api/posts
```

### 4. Server Actions

- Fill out the "New Post" form
- See instant feedback
- Check network tab for RPC calls

## What Makes This Special

1. **Zero Configuration**: Works out of the box
2. **Type-Safe**: Full TypeScript support
3. **Fast**: HMR, optimized builds
4. **Developer Experience**: Clear errors, helpful logs
5. **Production Ready**: SSR, caching, error handling

## Next Steps

1. **Add Authentication**: Integrate real auth provider
2. **Database**: Add Prisma/Drizzle for data persistence
3. **Styling**: Add Tailwind CSS or your preferred styling
4. **Testing**: Add unit and E2E tests
5. **Deployment**: Deploy to Vercel, Netlify, or your preferred platform

## Learn More

- [Framework Documentation](/docs)
- [API Reference](/docs/README.md)
- [GitHub Repository](https://github.com/code-yeongyu/leeforge)

---

**Built with ❤️ using Leeforge Fusion**
