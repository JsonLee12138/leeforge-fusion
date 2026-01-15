export function generateTSConfig(): {
  compilerOptions: any;
  include: string[];
} {
  return {
    compilerOptions: {
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "bundler",
      allowSyntheticDefaultImports: true,
      strict: true,
      paths: {
        "@/*": ["./src/*"],
        "@leeforge/*": ["./packages/framework/src/*"],
      },
      jsx: "preserve",
      jsxImportSource: "solid-js",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      skipLibCheck: true,
      noEmit: true,
    },
    include: ["src/**/*", "packages/**/*"],
  };
}

export function writeTSConfigFile(path: string = "./tsconfig.json"): void {
  const { writeFileSync } = require("fs");
  const config = generateTSConfig();
  writeFileSync(path, JSON.stringify(config, null, 2));
}
