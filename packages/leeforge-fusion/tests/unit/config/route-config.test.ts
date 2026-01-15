import { describe, test, expect } from "vitest";
import {
  RouteConfigManager,
  validateRouteConfig,
  mergeRouteConfig,
} from "../../../src/config/route-config";

describe("RouteConfigManager", () => {
  test("uses defaults when no config provided", () => {
    const manager = new RouteConfigManager();
    const config = manager.getConfig();
    expect(config.base).toBe("/");
    expect(config.trailingSlash).toBe("never");
  });

  test("merges custom config correctly", () => {
    const manager = new RouteConfigManager({
      base: "/app",
      groups: { "(dashboard)": "/dashboard" },
    });
    const config = manager.getConfig();
    expect(config.base).toBe("/app");
    expect(manager.getGroupPath("(dashboard)")).toBe("/dashboard");
  });

  test("validates config", () => {
    expect(() => {
      new RouteConfigManager({ base: "invalid" });
    }).toThrow();
  });

  test("shouldIgnore works correctly", () => {
    const manager = new RouteConfigManager({
      ignore: ["**/test/**", "**/*.spec.ts"],
    });
    expect(manager.shouldIgnore("app/test/page.tsx")).toBe(true);
    expect(manager.shouldIgnore("app/page.spec.ts")).toBe(true);
    expect(manager.shouldIgnore("app/page.tsx")).toBe(false);
  });

  test("getGuard returns correct guard", () => {
    const manager = new RouteConfigManager({
      guards: {
        "/admin/*": "./middleware/auth.ts",
        "/dashboard/*": "./middleware/dashboard.ts",
      },
    });
    expect(manager.getGuard("/admin/users")).toBe("./middleware/auth.ts");
    expect(manager.getGuard("/dashboard/stats")).toBe(
      "./middleware/dashboard.ts",
    );
    expect(manager.getGuard("/public/page")).toBeUndefined();
  });
});

describe("validateRouteConfig", () => {
  test("validates correct config", () => {
    const result = validateRouteConfig({
      base: "/app",
      trailingSlash: "never",
    });
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  test("detects invalid base path", () => {
    const result = validateRouteConfig({ base: "invalid" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("base must start with /");
  });

  test("detects invalid trailingSlash", () => {
    const result = validateRouteConfig({ trailingSlash: "sometimes" as any });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'trailingSlash must be "never" or "always"',
    );
  });
});

describe("mergeRouteConfig", () => {
  test("merges configs correctly", () => {
    const base = {
      base: "/app",
      groups: { "(admin)": "/admin" },
    };
    const override = {
      trailingSlash: "always" as const,
      guards: { "/admin/*": "./auth.ts" },
    };

    const merged = mergeRouteConfig(base, override);
    expect(merged.base).toBe("/app");
    expect(merged.trailingSlash).toBe("always");
    expect(merged.groups).toEqual({ "(admin)": "/admin" });
    expect(merged.guards).toEqual({ "/admin/*": "./auth.ts" });
  });

  test("overrides base values", () => {
    const base = { base: "/app", trailingSlash: "never" as const };
    const override = { base: "/new" };

    const merged = mergeRouteConfig(base, override);
    expect(merged.base).toBe("/new");
    expect(merged.trailingSlash).toBe("never");
  });
});
