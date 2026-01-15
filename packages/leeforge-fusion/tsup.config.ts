import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  dts: true,
  sourcemap: true,
  target: "node18",
  external: [
    "solid-js",
    "@tanstack/solid-router",
    "@tanstack/solid-query",
    "hono",
    "express",
    "vite",
    "glob",
    "minimatch",
    "sirv",
    "compression",
  ],
  noExternal: [],
});
