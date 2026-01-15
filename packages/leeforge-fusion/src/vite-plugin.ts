import type { Plugin } from "vite";
import { RouteScanner } from "./router/scanner";
import { RouteGenerator } from "./router/generator";
import { join } from "path";

export interface FrameworkPluginOptions {
  appDir: string;
  apiDir?: string;
  outputDir?: string;
}

export function frameworkPlugin(options: FrameworkPluginOptions): Plugin {
  const scanner = new RouteScanner({ appDir: options.appDir });
  const generator = new RouteGenerator({
    outputDir: options.outputDir || join(options.appDir, ".generated"),
  });

  let isDev = false;

  const generateRoutes = async () => {
    try {
      const result = await scanner.scan();
      await generator.generate(result.routes);

      if (isDev) {
        console.log(`[leeforge] Generated ${result.routes.length} routes`);
      }
    } catch (error) {
      console.error("[leeforge] Failed to generate routes:", error);
    }
  };

  return {
    name: "leeforge-fusion",

    configResolved(config) {
      isDev = config.command === "serve";

      if (isDev) {
        generateRoutes();
      }
    },

    async buildStart() {
      if (!isDev) {
        await generateRoutes();
      }
    },

    handleHotUpdate({ file, server }) {
      if (file.startsWith(options.appDir)) {
        generateRoutes();

        server.ws.send({
          type: "full-reload",
        });
      }
    },

    resolveId(id) {
      if (id.startsWith("@/generated/")) {
        return id.replace(
          "@/generated/",
          join(options.outputDir || join(options.appDir, ".generated"), "/"),
        );
      }
      return null;
    },
  };
}
