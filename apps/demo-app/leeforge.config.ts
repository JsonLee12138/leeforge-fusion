import { defineConfig } from "@leeforge/fusion";

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
