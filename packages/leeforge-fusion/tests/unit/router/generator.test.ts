import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { RouteGenerator } from "../../../src/router/generator";
import { RouteScanner } from "../../../src/router/scanner";
import { join } from "path";
import { tmpdir } from "os";
import {
  mkdtempSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  readFileSync,
  existsSync,
} from "fs";

describe("RouteGenerator", () => {
  let testDir: string;
  let outputDir: string;
  let scanner: RouteScanner;
  let generator: RouteGenerator;

  beforeAll(() => {
    testDir = mkdtempSync(join(tmpdir(), "gen-test-"));
    outputDir = join(testDir, ".framework", "routes");

    mkdirSync(join(testDir, "app", "posts", "[id]"), { recursive: true });
    mkdirSync(join(testDir, "app", "(dashboard)"), { recursive: true });

    writeFileSync(
      join(testDir, "app", "page.tsx"),
      "export default () => <div>Home</div>",
    );
    writeFileSync(
      join(testDir, "app", "posts", "page.tsx"),
      "export default () => <div>Posts</div>",
    );
    writeFileSync(
      join(testDir, "app", "posts", "[id]", "page.tsx"),
      "export default () => <div>Post</div>",
    );
    writeFileSync(
      join(testDir, "app", "(dashboard)", "page.tsx"),
      "export default () => <div>Dashboard</div>",
    );

    scanner = new RouteScanner({ appDir: join(testDir, "app") });
    generator = new RouteGenerator({ outputDir });
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  test("generates client route files", async () => {
    const result = await scanner.scan();
    const generated = await generator.generate(result.routes);

    expect(generated.clientRoutes.length).toBeGreaterThan(0);

    generated.clientRoutes.forEach((file) => {
      expect(existsSync(file)).toBe(true);
    });
  });

  test("generates correct route paths", async () => {
    const result = await scanner.scan();
    await generator.generate(result.routes);

    const homeFile = join(outputDir, "page.ts");
    const content = readFileSync(homeFile, "utf-8");

    expect(content).toContain("createFileRoute('/$')");
    expect(content).toContain("function Pagetsx()");
  });

  test("generates manifest correctly", async () => {
    const result = await scanner.scan();
    const { manifest } = await generator.generate(result.routes);

    expect(manifest.routes).toBeDefined();
    expect(manifest.routes.length).toBeGreaterThan(0);
    expect(manifest.timestamp).toBeDefined();

    const homeRoute = manifest.routes.find((r: any) => r.path === "/");
    expect(homeRoute).toBeDefined();
    expect(homeRoute.type).toBe("page");
  });

  test("generates client entry file", async () => {
    const result = await scanner.scan();
    await generator.generate(result.routes);

    const entryFile = join(outputDir, "client-entry.ts");
    expect(existsSync(entryFile)).toBe(true);

    const content = readFileSync(entryFile, "utf-8");
    expect(content).toContain("createRouter");
    expect(content).toContain("routeTree");
    expect(content).toContain("QueryClient");
  });

  test("handles dynamic routes correctly", async () => {
    const result = await scanner.scan();
    await generator.generate(result.routes);

    const postFile = join(outputDir, "posts", "[id]", "page.ts");
    const content = readFileSync(postFile, "utf-8");

    expect(content).toContain("createFileRoute('/posts/$id')");
    expect(content).toContain("function PostsIdPagetsx()");
  });

  test("handles route groups correctly", async () => {
    const result = await scanner.scan();
    await generator.generate(result.routes);

    const dashboardFile = join(outputDir, "(dashboard)", "page.ts");
    const content = readFileSync(dashboardFile, "utf-8");

    expect(content).toContain("createFileRoute('/dashboard')");
  });
});
