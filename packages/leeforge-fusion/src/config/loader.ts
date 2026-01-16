import { existsSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

export interface LeeforgeConfig {
  routes?: {
    base?: string;
    trailingSlash?: "never" | "always";
    groups?: Record<string, string>;
    guards?: Record<string, string | string[]>;
    ignore?: string[];
  };

  api?: {
    prefix?: string;
    timeout?: number;
  };

  ssr?: {
    render?: "stream" | "static";
    timeout?: number;
  };

  vite?: {
    plugins?: any[];
    server?: {
      port?: number;
      host?: string;
      https?: boolean;
      proxy?: Record<string, any>;
    };
    build?: {
      outDir?: string;
      sourcemap?: boolean;
      target?: string | string[];
      rollupOptions?: {
        input?: Record<string, string>;
        external?: (string | RegExp)[];
      };
    };
    [key: string]: any;
  };

  [key: string]: any;
}

export interface ResolvedLeeforgeConfig extends LeeforgeConfig {
  routes: Required<NonNullable<LeeforgeConfig["routes"]>>;
  api: Required<NonNullable<LeeforgeConfig["api"]>>;
  ssr: Required<NonNullable<LeeforgeConfig["ssr"]>>;
}

const defaultConfig: ResolvedLeeforgeConfig = {
  routes: {
    base: "/",
    trailingSlash: "never",
    groups: {},
    guards: {},
    ignore: [],
  },
  api: {
    prefix: "/api",
    timeout: 5000,
  },
  ssr: {
    render: "stream",
    timeout: 10000,
  },
  vite: {},
};

export async function loadConfig(
  rootDir: string = process.cwd(),
): Promise<ResolvedLeeforgeConfig> {
  const configPath = join(rootDir, "leeforge.config.ts");

  if (!existsSync(configPath)) {
    return defaultConfig;
  }

  try {
    const configUrl = pathToFileURL(configPath).href;
    const configModule = await import(configUrl);
    const userConfig = configModule.default || configModule;

    return mergeConfig(defaultConfig, userConfig);
  } catch (error) {
    console.error("Failed to load leeforge.config.ts:", error);
    throw error;
  }
}

function mergeConfig(
  base: ResolvedLeeforgeConfig,
  override: LeeforgeConfig,
): ResolvedLeeforgeConfig {
  return {
    ...base,
    ...override,
    routes: {
      ...base.routes,
      ...override.routes,
      groups: { ...base.routes.groups, ...(override.routes?.groups || {}) },
      guards: { ...base.routes.guards, ...(override.routes?.guards || {}) },
      ignore: [
        ...(base.routes?.ignore || []),
        ...(override.routes?.ignore || []),
      ],
    },
    api: {
      ...base.api,
      ...(override.api || {}),
    },
    ssr: {
      ...base.ssr,
      ...(override.ssr || {}),
    },
    vite: {
      ...base.vite,
      ...(override.vite || {}),
    },
  };
}

export function extractViteConfig(
  config: ResolvedLeeforgeConfig,
): Record<string, any> {
  return config.vite || {};
}

export function defineConfig(config: LeeforgeConfig): LeeforgeConfig {
  return config;
}
