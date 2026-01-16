import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface InitOptions {
  template?: "basic" | "blog" | "dashboard";
  typescript?: boolean;
  install?: boolean;
  git?: boolean;
}

const templates = {
  basic: {
    name: "Basic App",
    description: "Simple app with home and about pages",
    files: {
      "src/app/layout.tsx": `import { JSX } from "solid-js";

export interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen">
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main>{props.children}</main>
      <footer>
        <p>© 2026 My App</p>
      </footer>
    </div>
  );
}
`,
      "src/app/index.tsx": `export default function Home() {
  return (
    <div>
      <h1>Welcome to Leeforge Fusion</h1>
      <p>This is your first app!</p>
    </div>
  );
}
`,
      "src/app/about.tsx": `export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>Learn more about Leeforge Fusion.</p>
    </div>
  );
}
`,
      "leeforge.config.ts": `import { defineConfig } from "@leeforge/fusion";

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
`,
      "package.json": `{
  "name": "my-app",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "leeforge dev",
    "build": "leeforge build",
    "preview": "leeforge preview"
  },
  "dependencies": {
    "@leeforge/fusion": "^0.1.0-beta.1",
    "@leeforge/fusion-cli": "^0.1.0-beta.1",
    "solid-js": "^1.9.10",
    "@tanstack/solid-router": "^1.150.0",
    "@tanstack/solid-query": "^5.90.20"
  }
}
`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*", "leeforge.config.ts"],
  "exclude": ["node_modules", "dist"]
}
`,
    },
  },
  blog: {
    name: "Blog App",
    description: "Blog with posts, categories, and RSS",
    files: {
      "src/app/layout.tsx": `import { JSX } from "solid-js";

export interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen">
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main>{props.children}</main>
      <footer>
        <p>© 2026 My Blog</p>
      </footer>
    </div>
  );
}
`,
      "src/app/index.tsx": `export default function Home() {
  return (
    <div>
      <h1>Welcome to My Blog</h1>
      <p>Share your thoughts with the world!</p>
    </div>
  );
}
`,
      "src/app/blog/index.tsx": `export default function Blog() {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        <li><a href="/blog/1">Post 1</a></li>
        <li><a href="/blog/2">Post 2</a></li>
      </ul>
    </div>
  );
}
`,
      "src/app/blog/[id].tsx": `export default function BlogPost() {
  return (
    <div>
      <h1>Blog Post</h1>
      <p>This is a dynamic route!</p>
    </div>
  );
}
`,
      "src/app/blog/new.tsx": `import { useServerAction } from "@leeforge/fusion/client";

export async function createPost(data: { title: string; content: string }) {
  return { id: Date.now(), ...data };
}

export default function NewPost() {
  const [create, { loading }] = useServerAction(createPost);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const result = await create({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    });

    if (result) {
      alert("Post created!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
`,
      "src/app/api/posts/route.ts": `export async function GET() {
  return Response.json({ posts: [] });
}

export async function POST({ request }) {
  const data = await request.json();
  return Response.json({ id: Date.now(), ...data }, { status: 201 });
}
`,
      "leeforge.config.ts": `import { defineConfig } from "@leeforge/fusion";

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
`,
      "package.json": `{
  "name": "my-blog",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "leeforge dev",
    "build": "leeforge build",
    "preview": "leeforge preview"
  },
  "dependencies": {
    "@leeforge/fusion": "^0.1.0-beta.1",
    "@leeforge/fusion-cli": "^0.1.0-beta.1",
    "solid-js": "^1.9.10",
    "@tanstack/solid-router": "^1.150.0",
    "@tanstack/solid-query": "^5.90.20"
  }
}
`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*", "leeforge.config.ts"],
  "exclude": ["node_modules", "dist"]
}
`,
    },
  },
  dashboard: {
    name: "Dashboard App",
    description: "Admin dashboard with authentication",
    files: {
      "src/app/layout.tsx": `import { JSX } from "solid-js";

export interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen">
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>
      <main>{props.children}</main>
      <footer>
        <p>© 2026 Dashboard</p>
      </footer>
    </div>
  );
}
`,
      "src/app/index.tsx": `export default function Home() {
  return (
    <div>
      <h1>Dashboard Home</h1>
      <p>Welcome to your admin panel.</p>
    </div>
  );
}
`,
      "src/app/dashboard/index.tsx": `export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Protected area for authenticated users.</p>
    </div>
  );
}
`,
      "src/app/admin/index.tsx": `export default function Admin() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Admin only area.</p>
    </div>
  );
}
`,
      "src/middleware/auth.ts": `import { createMiddleware } from "@leeforge/fusion/middleware";

export const requireAuth = createMiddleware(async (ctx, next) => {
  const token = ctx.req.header("Authorization");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await next();
});

export const requireAdmin = createMiddleware(async (ctx, next) => {
  const user = ctx.get("user");

  if (!user || user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await next();
});
`,
      "src/app/api/login/route.ts": `export async function POST({ request }) {
  const { email, password } = await request.json();

  // Mock authentication
  if (email === "admin@example.com" && password === "admin") {
    return Response.json({
      token: "mock-token",
      user: { id: 1, email, role: "admin" },
    });
  }

  return Response.json({ error: "Invalid credentials" }, { status: 401 });
}
`,
      "leeforge.config.ts": `import { defineConfig } from "@leeforge/fusion";

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
  },
});
`,
      "package.json": `{
  "name": "my-dashboard",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "leeforge dev",
    "build": "leeforge build",
    "preview": "leeforge preview"
  },
  "dependencies": {
    "@leeforge/fusion": "^0.1.0-beta.1",
    "@leeforge/fusion-cli": "^0.1.0-beta.1",
    "solid-js": "^1.9.10",
    "@tanstack/solid-router": "^1.150.0",
    "@tanstack/solid-query": "^5.90.20"
  }
}
`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*", "leeforge.config.ts"],
  "exclude": ["node_modules", "dist"]
}
`,
    },
  },
};

export async function initCommand(projectName: string, options: InitOptions) {
  const template = options.template || "basic";
  const targetDir = projectName;

  console.log(`🚀 Creating new Leeforge Fusion project...`);
  console.log(`📁 Project: ${projectName}`);
  console.log(`📦 Template: ${template}`);
  console.log();

  // Check if directory exists
  if (existsSync(targetDir)) {
    console.error(`❌ Error: Directory "${targetDir}" already exists!`);
    process.exit(1);
  }

  // Create directory
  mkdirSync(targetDir, { recursive: true });

  // Get template
  const templateData = templates[template];
  if (!templateData) {
    console.error(`❌ Error: Template "${template}" not found!`);
    console.log(`Available templates: basic, blog, dashboard`);
    process.exit(1);
  }

  console.log(`📝 Creating files...`);

  // Create files
  for (const [filePath, content] of Object.entries(templateData.files)) {
    const fullPath = join(targetDir, filePath);
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));

    mkdirSync(dir, { recursive: true });
    writeFileSync(fullPath, content);

    console.log(`  ✓ ${filePath}`);
  }

  console.log();
  console.log(`✅ Project created successfully!`);
  console.log();
  console.log(`Next steps:`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
  console.log(`  npm run dev`);
  console.log();
  console.log(`Happy coding! 🚀`);
}
