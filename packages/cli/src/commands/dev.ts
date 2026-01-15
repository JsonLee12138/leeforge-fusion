export async function devCommand(options: { port?: number } = {}) {
  try {
    const { startDevServer } = await import("@leeforge/fusion");
    await startDevServer({
      port: options.port || 3000,
      appDir: "src/app",
      rootDir: process.cwd(),
    });
  } catch (error) {
    console.error("Failed to start dev server:", error);
    process.exit(1);
  }
}
