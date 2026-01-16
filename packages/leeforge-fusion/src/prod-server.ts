import express from "express";
import { join } from "path";
import { existsSync } from "fs";

import { ContextManager } from "./ssr/context";
import { SSRRenderer } from "./ssr/renderer";
import { APIRegistry } from "./api/registry";
import { QueryClient } from "@tanstack/solid-query";

export interface ProdServerOptions {
  port: number;
  distDir?: string;
  routesFile?: string;
  apiRoutesFile?: string;
}

export async function startProdServer(options: ProdServerOptions) {
  const distDir = options.distDir || join(process.cwd(), "dist");
  const clientDir = join(distDir, "client");
  const serverDir = join(distDir, "server");

  const routesFile = options.routesFile || join(serverDir, "routes.js");
  const apiRoutesFile =
    options.apiRoutesFile || join(serverDir, "api-routes.js");

  const app = express();

  if (existsSync(clientDir)) {
    app.use(express.static(clientDir));
  }

  if (existsSync(apiRoutesFile)) {
    const apiRoutesModule = await import(apiRoutesFile);
    const apiRegistry = new APIRegistry();

    if (apiRoutesModule.default) {
      await apiRegistry.register(apiRoutesModule.default);

      const honoApp = apiRegistry.getApp();
      app.use("/api", async (req, res, next) => {
        try {
          await honoApp.fetch(req as any, res as any);
        } catch (error) {
          next(error);
        }
      });
    }
  }

  await import(routesFile);

  const queryClient = new QueryClient();
  const renderer = new SSRRenderer({
    queryClient,
  });

  app.get("*", async (req, res, next) => {
    const url = req.url;

    if (url.includes(".") && !url.includes(".html")) {
      return next();
    }

    try {
      const context = ContextManager.createContext({
        request: req as any,
        API_BASE: "/api",
      });

      const result = await renderer.render({
        url,
        context,
      });

      Object.entries(result.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.status(result.status).send(result.html);
    } catch (error) {
      console.error("SSR Error:", error);
      res.status(500).send("<h1>500 - Server Error</h1>");
    }
  });

  const server = app.listen(options.port, () => {
    console.log(
      `🚀 Leeforge Production Server running on http://localhost:${options.port}`,
    );
  });

  process.on("SIGTERM", () => {
    server.close();
    process.exit(0);
  });

  return { server, app };
}
