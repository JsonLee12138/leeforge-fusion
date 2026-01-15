import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { APIScanner } from "../../../src/api/scanner";
import { join } from "path";
import { tmpdir } from "os";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "fs";

describe("APIScanner", () => {
  let testDir: string;
  let apiDir: string;

  beforeAll(() => {
    testDir = mkdtempSync(join(tmpdir(), "api-test-"));
    apiDir = join(testDir, "api");

    mkdirSync(join(apiDir, "posts"), { recursive: true });
    mkdirSync(join(apiDir, "users", "[id]"), { recursive: true });

    writeFileSync(
      join(apiDir, "posts", "route.ts"),
      `
export async function GET() {
  return Response.json([{ id: 1, title: "Post 1" }]);
}

export async function POST(req: Request) {
  const data = await req.json();
  return Response.json(data, { status: 201 });
}
`,
    );

    writeFileSync(
      join(apiDir, "users", "[id]", "route.ts"),
      `
export async function GET(req, { params }) {
  return Response.json({ id: params.id });
}

export async function DELETE() {
  return Response.json({ success: true });
}
`,
    );
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  test("scans API routes", async () => {
    const scanner = new APIScanner(apiDir);
    const routes = await scanner.scan();

    expect(routes.length).toBeGreaterThan(0);
  });

  test("identifies correct paths", async () => {
    const scanner = new APIScanner(apiDir);
    const routes = await scanner.scan();

    const postsRoute = routes.find((r) => r.path === "/posts");
    expect(postsRoute).toBeDefined();

    const usersRoute = routes.find((r) => r.path === "/users/:id");
    expect(usersRoute).toBeDefined();
  });

  test("extracts HTTP methods", async () => {
    const scanner = new APIScanner(apiDir);
    const routes = await scanner.scan();

    const postsRoute = routes.find((r) => r.path === "/posts");
    expect(postsRoute?.methods).toContain("GET");
    expect(postsRoute?.methods).toContain("POST");

    const usersRoute = routes.find((r) => r.path === "/users/:id");
    expect(usersRoute?.methods).toContain("GET");
    expect(usersRoute?.methods).toContain("DELETE");
  });

  test("handles dynamic route parameters", async () => {
    const scanner = new APIScanner(apiDir);
    const routes = await scanner.scan();

    const usersRoute = routes.find((r) => r.path === "/users/:id");
    expect(usersRoute).toBeDefined();
    expect(usersRoute?.path).toBe("/users/:id");
  });

  test("sorts methods alphabetically", async () => {
    const scanner = new APIScanner(apiDir);
    const routes = await scanner.scan();

    const postsRoute = routes.find((r) => r.path === "/posts");
    expect(postsRoute?.methods).toEqual(["GET", "POST"]);
  });
});
