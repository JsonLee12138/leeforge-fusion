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
