import { existsSync } from "fs";
import { join } from "path";

export async function devCommand(options: { port?: number } = {}) {
  try {
    const fusion = (await import("@leeforge/fusion")) as any;
    const rootDir = process.cwd();
    const config = await fusion.loadConfig(rootDir);

    const port = options.port || config.vite?.server?.port || 3000;

    const possibleAppDirs = ["src/app", "app", "src", "."];

    let appDir = "src/app";
    for (const dir of possibleAppDirs) {
      const appPath = join(rootDir, dir);
      if (existsSync(appPath)) {
        const hasPageFiles =
          existsSync(join(appPath, "index.tsx")) ||
          existsSync(join(appPath, "index.ts")) ||
          existsSync(join(appPath, "page.tsx")) ||
          existsSync(join(appPath, "page.ts")) ||
          existsSync(join(appPath, "layout.tsx")) ||
          existsSync(join(appPath, "layout.ts"));

        if (hasPageFiles) {
          appDir = dir;
          break;
        }
      }
    }

    await fusion.startDevServer({
      port,
      appDir,
      rootDir,
    });
  } catch (error) {
    console.error("Failed to start dev server:", error);
    process.exit(1);
  }
}
