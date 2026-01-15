export async function buildCommand() {
  try {
    const { build } = await import("vite");

    await build({
      build: {
        outDir: "dist/client",
        rollupOptions: {
          output: {
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
      build: {
        outDir: "dist/server",
        ssr: true,
        rollupOptions: {
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
