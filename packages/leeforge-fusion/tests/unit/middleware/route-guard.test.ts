import { describe, test, expect } from "vitest";
import {
  defineGuard,
  requireAuth,
  requireAdmin,
  requireGuest,
  createGuardChain,
  type LoaderContext,
} from "../../../src/middleware/route-guard";
import { redirect, isRedirectError } from "../../../src/middleware/redirect";

describe("Route Guards", () => {
  test("defineGuard creates a guard function", async () => {
    const guard = defineGuard((ctx) => {
      if (!ctx.params.id) {
        throw redirect("/not-found");
      }
    });

    const ctx: LoaderContext = {
      params: { id: "123" },
      request: new Request("http://localhost"),
    };

    await expect(guard(ctx)).resolves.not.toThrow();
  });

  test("requireAuth throws redirect when no user", async () => {
    const ctx: LoaderContext = {
      params: {},
      request: new Request("http://localhost"),
    };

    try {
      await requireAuth(ctx);
      expect.fail("Should have thrown");
    } catch (error) {
      expect(isRedirectError(error)).toBe(true);
    }
  });

  test("requireAuth passes when user exists", async () => {
    const ctx: LoaderContext = {
      params: {},
      user: { id: "123", role: "user" },
      request: new Request("http://localhost"),
    };

    await expect(requireAuth(ctx)).resolves.not.toThrow();
  });

  test("requireAdmin throws when user is not admin", async () => {
    const ctx: LoaderContext = {
      params: {},
      user: { id: "123", role: "user" },
      request: new Request("http://localhost"),
    };

    try {
      await requireAdmin(ctx);
      expect.fail("Should have thrown");
    } catch (error) {
      expect(isRedirectError(error)).toBe(true);
    }
  });

  test("requireAdmin passes when user is admin", async () => {
    const ctx: LoaderContext = {
      params: {},
      user: { id: "123", role: "admin" },
      request: new Request("http://localhost"),
    };

    await expect(requireAdmin(ctx)).resolves.not.toThrow();
  });

  test("requireGuest throws when user exists", async () => {
    const ctx: LoaderContext = {
      params: {},
      user: { id: "123" },
      request: new Request("http://localhost"),
    };

    try {
      await requireGuest(ctx);
      expect.fail("Should have thrown");
    } catch (error) {
      expect(isRedirectError(error)).toBe(true);
    }
  });

  test("requireGuest passes when no user", async () => {
    const ctx: LoaderContext = {
      params: {},
      request: new Request("http://localhost"),
    };

    await expect(requireGuest(ctx)).resolves.not.toThrow();
  });

  test("createGuardChain combines multiple guards", async () => {
    const guard1 = defineGuard((ctx) => {
      if (!ctx.user) throw redirect("/login");
    });

    const guard2 = defineGuard((ctx) => {
      if (ctx.user?.role !== "admin") throw redirect("/unauthorized");
    });

    const chain = createGuardChain(guard1, guard2);

    const ctx: LoaderContext = {
      params: {},
      user: { id: "123", role: "admin" },
      request: new Request("http://localhost"),
    };

    await expect(chain(ctx)).resolves.not.toThrow();
  });

  test("createGuardChain fails if any guard fails", async () => {
    const guard1 = defineGuard((ctx) => {
      if (!ctx.user) throw redirect("/login");
    });

    const guard2 = defineGuard((ctx) => {
      if (ctx.user?.role !== "admin") throw redirect("/unauthorized");
    });

    const chain = createGuardChain(guard1, guard2);

    const ctx: LoaderContext = {
      params: {},
      user: { id: "123", role: "user" },
      request: new Request("http://localhost"),
    };

    try {
      await chain(ctx);
      expect.fail("Should have thrown");
    } catch (error) {
      expect(isRedirectError(error)).toBe(true);
    }
  });
});
