import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { RouteScanner } from "../../../src/router/scanner";
import { join } from "path";
import { tmpdir } from "os";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "fs";

describe("RouteScanner", () => {
  let testDir: string;
  let scanner: RouteScanner;

  beforeAll(() => {
    testDir = mkdtempSync(join(tmpdir(), "leeforge-test-"));

    mkdirSync(join(testDir, "app"), { recursive: true });
    writeFileSync(
      join(testDir, "app", "page.tsx"),
      "export default () => <div>Home</div>",
    );
    writeFileSync(
      join(testDir, "app", "layout.tsx"),
      "export default () => <div>Layout</div>",
    );

    mkdirSync(join(testDir, "app", "posts"), { recursive: true });
    writeFileSync(
      join(testDir, "app", "posts", "page.tsx"),
      "export default () => <div>Posts</div>",
    );

    mkdirSync(join(testDir, "app", "posts", "[postId]"), { recursive: true });
    writeFileSync(
      join(testDir, "app", "posts", "[postId]", "page.tsx"),
      "export default () => <div>Post</div>",
    );

    mkdirSync(join(testDir, "app", "(dashboard)"), { recursive: true });
    writeFileSync(
      join(testDir, "app", "(dashboard)", "page.tsx"),
      "export default () => <div>Dashboard</div>",
    );

    mkdirSync(join(testDir, "app", "api", "posts"), { recursive: true });
    writeFileSync(
      join(testDir, "app", "api", "posts", "route.ts"),
      "export default () => {}",
    );

    scanner = new RouteScanner({ appDir: join(testDir, "app") });
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  test("scans basic routes", async () => {
    const result = await scanner.scan();
    const routes = result.routes;

    expect(routes.length).toBeGreaterThan(0);

    const homeRoute = routes.find((r) => r.path === "/");
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.type).toBe("page");
    expect(homeRoute?.file).toContain("page.tsx");
  });

  test("handles dynamic routes", async () => {
    const result = await scanner.scan();
    const routes = result.routes;

    const postsRoute = routes.find((r) => r.path === "/posts");
    expect(postsRoute).toBeDefined();
    expect(postsRoute?.children).toBeDefined();

    const postRoute = postsRoute?.children?.find(
      (r) => r.path === "/posts/:postId",
    );
    expect(postRoute).toBeDefined();
    expect(postRoute?.params).toContain("postId");
  });

  test("handles route groups", async () => {
    const result = await scanner.scan();
    const routes = result.routes;

    const dashboardRoute = routes.find((r) => r.path === "/dashboard");
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.file).toContain("(dashboard)");
  });

  test("identifies API routes", async () => {
    const result = await scanner.scan();
    const routes = result.routes;

    const apiRoute = routes.find((r) => r.path === "/api/posts");
    expect(apiRoute).toBeDefined();
    expect(apiRoute?.type).toBe("api");
  });

  test("detects route conflicts", async () => {
    writeFileSync(
      join(testDir, "app", "page.tsx"),
      "export default () => <div>Home 2</div>",
    );

    const scanner2 = new RouteScanner({ appDir: join(testDir, "app") });
    const result = await scanner2.scan();

    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  test("handles nested layouts", async () => {
    mkdirSync(join(testDir, "app", "blog", "posts"), { recursive: true });
    writeFileSync(
      join(testDir, "app", "blog", "layout.tsx"),
      "export default () => <div>Blog Layout</div>",
    );
    writeFileSync(
      join(testDir, "app", "blog", "posts", "page.tsx"),
      "export default () => <div>Blog Posts</div>",
    );

    const scanner2 = new RouteScanner({ appDir: join(testDir, "app") });
    const result = await scanner2.scan();

    const blogRoute = result.routes.find((r) => r.path === "/blog");
    expect(blogRoute).toBeDefined();
    expect(blogRoute?.children).toBeDefined();
  });

  test("generates correct component names", async () => {
    const result = await scanner.scan();
    const routes = result.routes;

    const homeRoute = routes.find((r) => r.path === "/");
    expect(homeRoute?.componentName).toMatch(/^[A-Z]/);
  });

  test("generates correct import names", async () => {
    const result = await scanner.scan();
    const routes = result.routes;

    const homeRoute = routes.find((r) => r.path === "/");
    expect(homeRoute?.importName).toBeDefined();
    expect(homeRoute?.importName).not.toContain("/");
  });
});
