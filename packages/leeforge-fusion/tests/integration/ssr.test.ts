import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { join } from "path";
import { tmpdir } from "os";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { RouteScanner } from "../../src/router/scanner";
import { APIScanner } from "../../src/api/scanner";
import { composeMiddleware } from "../../src/middleware/hono";
import {
  createGuardChain,
  defineGuard,
} from "../../src/middleware/route-guard";
import { redirect } from "../../src/middleware/redirect";

describe("SSR Integration", () => {
  let testDir: string;
  let appDir: string;

  beforeAll(() => {
    testDir = mkdtempSync(join(tmpdir(), "ssr-int-"));
    appDir = join(testDir, "app");

    mkdirSync(join(appDir, "posts", "[id]"), { recursive: true });

    writeFileSync(
      join(appDir, "layout.tsx"),
      `
export default function Layout({ children }: any) {
  return (
    <html>
      <head><title>Test App</title></head>
      <body>{children}</body>
    </html>
  );
}
`,
    );

    writeFileSync(
      join(appDir, "page.tsx"),
      `
export default function Home() {
  return <div>Home Page</div>;
}

export const loader = async () => {
  return { message: "Hello from loader" };
};
`,
    );

    writeFileSync(
      join(appDir, "posts", "page.tsx"),
      `
export default function Posts() {
  const { posts } = Route.useLoaderData();
  return <div>{posts.length} posts</div>;
}

export const loader = async () => {
  return { posts: [{ id: 1, title: "Post 1" }] };
};
`,
    );

    writeFileSync(
      join(appDir, "posts", "[id]", "page.tsx"),
      `
export default function Post() {
  const { post } = Route.useLoaderData();
  return <div>{post.title}</div>;
}

export const loader = async ({ params }) => {
  return { post: { id: params.id, title: "Post " + params.id } };
};
`,
    );
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  test("complete SSR flow", async () => {
    const scanner = new RouteScanner({ appDir });
    const scanResult = await scanner.scan();

    expect(scanResult.routes.length).toBeGreaterThan(0);
  });

  test("API route integration", async () => {
    const apiDir = join(testDir, "app", "api");
    mkdirSync(join(apiDir, "posts"), { recursive: true });
    writeFileSync(
      join(apiDir, "posts", "route.ts"),
      `
export async function GET() {
  return Response.json([{ id: 1, title: "API Post" }]);
}
`,
    );

    const scanner = new APIScanner(apiDir);
    const routes = await scanner.scan();

    expect(routes.length).toBe(1);
    expect(routes[0].path).toBe("/posts");
    expect(routes[0].methods).toContain("GET");
  });

  test("middleware chain integration", async () => {
    let order: number[] = [];

    const m1 = async (ctx: any, next: any) => {
      order.push(1);
      await next();
      order.push(4);
    };

    const m2 = async (ctx: any, next: any) => {
      order.push(2);
      await next();
      order.push(3);
    };

    const composed = composeMiddleware([m1, m2]);

    const ctx = {
      req: { path: "/test" },
      res: { status: 200, headers: {}, body: null },
      set: () => {},
    } as any;

    await composed(ctx, async () => {
      order.push(2.5);
    });

    expect(order).toEqual([1, 2, 2.5, 3, 4]);
  });

  test("guard chain integration", async () => {
    const guard1 = defineGuard((ctx) => {
      if (!ctx.user) {
        throw redirect("/login");
      }
    });

    const guard2 = defineGuard((ctx) => {
      if (ctx.user?.role !== "admin") {
        throw redirect("/unauthorized");
      }
    });

    const chain = createGuardChain(guard1, guard2);

    const validContext = {
      user: { id: "1", role: "admin" },
      params: {},
      request: new Request("http://localhost"),
    };

    const invalidContext = {
      user: { id: "1", role: "user" },
      params: {},
      request: new Request("http://localhost"),
    };

    await expect(chain(validContext)).resolves.not.toThrow();
    await expect(chain(invalidContext)).rejects.toThrow();
  });
});
