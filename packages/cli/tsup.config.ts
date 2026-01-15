import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  dts: false,
  sourcemap: false,
  target: "node18",
  external: [
    "commander",
    "inquirer",
    "ora",
    "chalk",
    "fs-extra",
    "glob",
    "minimatch",
    "@leeforge/fusion",
    "vite",
    "solid-js",
    "@tanstack/solid-router",
    "@tanstack/solid-query",
  ],
  noExternal: [],
});
