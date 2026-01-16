export async function buildCommand() {
  try {
    const { build } = await import("vite");
    const { loadConfig, extractViteConfig } = await import("@leeforge/fusion");

    const config = await loadConfig(process.cwd());
    const viteConfig = extractViteConfig(config);

    await build({
      ...viteConfig,
      build: {
        ...viteConfig.build,
        outDir: "dist/client",
        rollupOptions: {
          ...viteConfig.build?.rollupOptions,
          output: {
            ...viteConfig.build?.rollupOptions?.output,
            manualChunks: {
              vendor: [
                "solid-js",
                "@tanstack/solid-router",
                "@tanstack/solid-query",
              ],
            },
          },
        },
      },
    });

    await build({
      ...viteConfig,
      build: {
        ...viteConfig.build,
        outDir: "dist/server",
        ssr: true,
        rollupOptions: {
          ...viteConfig.build?.rollupOptions,
          input: "src/entry-server.tsx",
        },
      },
    });

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}
