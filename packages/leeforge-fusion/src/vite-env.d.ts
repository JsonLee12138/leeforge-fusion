/// <reference types="vite/client" />

declare module "glob" {
  import { IOptions } from "minimatch";

  interface GlobOptions extends IOptions {
    ignore?: string | string[];
    nodir?: boolean;
    dot?: boolean;
    nodot?: boolean;
    absolute?: boolean;
    cwd?: string;
    realpath?: boolean;
    follow?: boolean;
    realpathCache?: Map<string, string>;
    statCache?: Map<string, import("fs").Stats>;
    symlinks?: Map<string, string>;
    cache?: boolean;
  }

  function glob(pattern: string, options?: GlobOptions): Promise<string[]>;
  function globSync(pattern: string, options?: GlobOptions): string[];

  export { glob, globSync };
  export default glob;
}
