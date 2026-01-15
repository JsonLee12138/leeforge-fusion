import { minimatch } from "minimatch";

export interface RouteConfig {
  base?: string;
  trailingSlash?: "never" | "always";
  groups?: Record<string, string>;
  guards?: Record<string, string>;
  ignore?: string[];
}

export interface ResolvedRouteConfig extends RouteConfig {
  base: string;
  trailingSlash: "never" | "always";
  groups: Record<string, string>;
  guards: Record<string, string>;
  ignore: string[];
}

const defaults: ResolvedRouteConfig = {
  base: "/",
  trailingSlash: "never",
  groups: {},
  guards: {},
  ignore: [],
};

export function validateRouteConfig(config: RouteConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.base && !config.base.startsWith("/")) {
    errors.push("base must start with /");
  }

  if (
    config.trailingSlash &&
    !["never", "always"].includes(config.trailingSlash)
  ) {
    errors.push('trailingSlash must be "never" or "always"');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function mergeRouteConfig(
  base: RouteConfig,
  override: RouteConfig,
): ResolvedRouteConfig {
  return {
    ...defaults,
    ...base,
    ...override,
    groups: { ...defaults.groups, ...base.groups, ...override.groups },
    guards: { ...defaults.guards, ...base.guards, ...override.guards },
    ignore: [...(base.ignore || []), ...(override.ignore || [])],
  };
}

export class RouteConfigManager {
  private config: ResolvedRouteConfig;

  constructor(config?: RouteConfig) {
    this.config = this.resolveConfig(config || {});
  }

  private resolveConfig(config: RouteConfig): ResolvedRouteConfig {
    const validation = validateRouteConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid route config: ${validation.errors.join(", ")}`);
    }

    return {
      base: config.base || "/",
      trailingSlash: config.trailingSlash || "never",
      groups: config.groups || {},
      guards: config.guards || {},
      ignore: config.ignore || [],
    };
  }

  getGroupPath(group: string): string | undefined {
    return this.config.groups[group];
  }

  shouldIgnore(path: string): boolean {
    return this.config.ignore.some((pattern) => minimatch(path, pattern));
  }

  getGuard(path: string): string | undefined {
    for (const [pattern, guard] of Object.entries(this.config.guards)) {
      if (minimatch(path, pattern)) {
        return guard;
      }
    }
    return undefined;
  }

  getConfig(): ResolvedRouteConfig {
    return { ...this.config };
  }
}
