import { defineConfig } from "@leeforge/fusion";

export default defineConfig({
  routes: {
    base: "/",
    trailingSlash: "never",
    groups: {
      "(dashboard)": "/dashboard",
    },
    guards: {
      "/dashboard/*": "./src/middleware/auth.ts",
      "/api/posts/*": "./src/middleware/auth.ts",
    },
    ignore: ["**/*.spec.ts", "**/test/**"],
  },
});
