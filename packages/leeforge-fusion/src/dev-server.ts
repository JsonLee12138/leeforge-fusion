import { createServer } from "vite";
import { join } from "path";
import { createServer as createHttpServer } from "http";
import { existsSync } from "fs";
import { loadConfig, extractViteConfig } from "./config/loader";
import { RouteScanner } from "./router/scanner";

export interface DevServerOptions {
  port: number;
  appDir: string;
  apiDir?: string;
  rootDir?: string;
}

export async function startDevServer(options: DevServerOptions) {
  const rootDir = options.rootDir || process.cwd();
  const appDir = join(rootDir, options.appDir);

  const config = await loadConfig(rootDir);
  const viteConfig = extractViteConfig(config);

  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: "custom",
    ...viteConfig,
  });

  const port = await findAvailablePort(options.port);

  const scanner = new RouteScanner({
    appDir,
    ignore: ["**/node_modules/**", "**/.git/**"],
    cache: false,
  });

  const scanResult = await scanner.scan();
  const routes = scanResult.routes;

  const routePaths: string[] = [];
  const buildRoutePaths = (routeList: any[]) => {
    for (const route of routeList) {
      if (route.type === "page") {
        routePaths.push(route.path);
      }
      if (route.children) {
        buildRoutePaths(route.children);
      }
    }
  };
  buildRoutePaths(routes);

  const layoutPath = join(appDir, "layout.tsx");
  const layoutExists = existsSync(layoutPath);

  const server = createHttpServer(async (req, res) => {
    const url = req.url || "/";
    const path = url.split("?")[0];

    let isValidRoute = routePaths.includes(path);

    if (!isValidRoute) {
      for (const routePath of routePaths) {
        if (routePath.includes(":")) {
          const regexPattern = routePath
            .replace(/:[^/]+/g, "[^/]+")
            .replace(/\//g, "\\/");
          const regex = new RegExp(`^${regexPattern}$`);
          if (regex.test(path)) {
            isValidRoute = true;
            break;
          }
        }
      }
    }

    if (isValidRoute) {
      let pageContent = "";
      let pageTitle = "Leeforge Fusion";

      if (path === "/") {
        pageTitle = "Home";
        pageContent =
          "<h1>Welcome to Leeforge Fusion</h1><p>This is the home page.</p>";
      } else if (path === "/about") {
        pageTitle = "About";
        pageContent =
          "<h1>About Leeforge Fusion</h1><p>Full-stack framework for Solid.js</p>";
      } else if (path === "/blog") {
        pageTitle = "Blog";
        pageContent =
          "<h1>Blog Posts</h1><ul><li>Post 1</li><li>Post 2</li></ul>";
      } else if (path === "/blog/new") {
        pageTitle = "New Post";
        pageContent = "<h1>Create New Post</h1><form>...</form>";
      } else if (path === "/dashboard") {
        pageTitle = "Dashboard";
        pageContent = "<h1>Dashboard</h1><p>Protected area</p>";
      } else if (path === "/admin") {
        pageTitle = "Admin";
        pageContent = "<h1>Admin Panel</h1><p>Admin only</p>";
      } else if (path.startsWith("/blog/")) {
        const id = path.split("/")[2];
        pageTitle = `Blog Post ${id}`;
        pageContent = `<h1>Blog Post ${id}</h1><p>Content for post ${id}</p>`;
      } else {
        pageTitle = path;
        pageContent = `<h1>${path}</h1><p>This is a dynamically generated page.</p>`;
      }

      const html = generateHTML({
        title: pageTitle,
        path,
        layoutExists,
        content: pageContent,
        status: "200",
        routePaths,
      });

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } else {
      const html = generateHTML({
        title: "404 - Page Not Found",
        path,
        layoutExists: false,
        content: `<h1>404 - Page Not Found</h1><p>The page <strong>${path}</strong> does not exist.</p><p><a href="/">Go back home</a></p>`,
        status: "404",
        isError: true,
        routePaths,
      });

      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(html);
    }
  });

  server.listen(port, () => {
    console.log(`🚀 Leeforge Dev Server running on http://localhost:${port}`);
    console.log(`📁 Serving from: ${appDir}`);
    console.log(
      `🔗 Routes: ${routePaths.length > 0 ? routePaths.join(", ") : "No routes found"}`,
    );
    console.log(`⚠️  404: Any other route will show error page`);
  });

  return { server, vite };
}

async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const tryPort = (port: number) => {
      const server = createHttpServer();

      server.on("error", () => {
        server.close();
        console.log(`⚠️  Port ${port} is in use, trying ${port + 1}...`);
        tryPort(port + 1);
      });

      server.on("listening", () => {
        server.close(() => {
          resolve(port);
        });
      });

      server.listen(port);
    };

    tryPort(startPort);
  });
}

function generateHTML(options: {
  title: string;
  path: string;
  layoutExists: boolean;
  content: string;
  status: string;
  isError?: boolean;
  routePaths?: string[];
}) {
  const statusColor = options.isError ? "#dc2626" : "#2563eb";
  const statusBg = options.isError ? "#fee2e2" : "#dbeafe";

  const navLinks = options.routePaths
    ? options.routePaths
        .filter((route) => !route.includes(":"))
        .map((route) => {
          let label;
          if (route === "/") {
            label = "Home";
          } else if (route === "/blog/new") {
            label = "New Post";
          } else {
            label = route.slice(1).replace(/\/.*/g, "").replace(/-/g, " ");
            label = label.charAt(0).toUpperCase() + label.slice(1);
          }
          return `<a href="${route}">${label}</a>`;
        })
        .join("")
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options.title} - Leeforge Fusion</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui; margin: 0; background: #f5f5f5; }
          .container { max-width: 900px; margin: 0 auto; background: white; min-height: 100vh; }
          header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 2rem; }
          nav { display: flex; gap: 1rem; align-items: center; }
          nav a { color: #374151; text-decoration: none; font-weight: 500; }
          nav a:hover { color: #111827; }
          nav a[href="${options.path}"] { color: ${statusColor}; border-bottom: 2px solid ${statusColor}; }
          main { padding: 2rem; }
          footer { border-top: 1px solid #e5e7eb; padding: 1rem 2rem; color: #6b7280; font-size: 0.875rem; text-align: center; }
          .page-content { background: ${statusBg}; padding: 1.5rem; border-radius: 0.5rem; margin-top: 1rem; }
          .debug { background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; font-family: monospace; font-size: 0.875rem; }
          .status-badge { display: inline-block; padding: 0.25rem 0.75rem; background: ${statusColor}; color: white; border-radius: 0.25rem; font-weight: bold; font-size: 0.875rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <nav>
              <a href="/" class="logo"><strong>Leeforge</strong></a>
              ${navLinks}
            </nav>
          </header>
          <main>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h1 style="margin: 0;">${options.title}</h1>
              <span class="status-badge">HTTP ${options.status}</span>
            </div>
            <div class="page-content">
              ${options.content}
            </div>
            <div class="debug">
              <strong>Current Path:</strong> ${options.path}<br>
              <strong>Layout Exists:</strong> ${options.layoutExists}<br>
              <strong>Status:</strong> ${options.status}<br>
              <strong>Server:</strong> Leeforge Fusion Dev Server
            </div>
          </main>
          <footer>
            © 2026 Leeforge Fusion
          </footer>
        </div>
      </body>
    </html>
  `;
}
