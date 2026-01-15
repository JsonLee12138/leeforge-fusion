declare module "@leeforge/fusion" {
  export function startDevServer(options: {
    port: number;
    appDir: string;
    rootDir?: string;
  }): Promise<any>;

  export function build(options?: any): Promise<any>;
}

declare module "@leeforge/fusion/data" {
  export function createServerData<T>(
    loader: (ctx: any) => Promise<T>,
  ): () => T;
}

declare module "@leeforge/fusion/client" {
  export function useServerAction<T extends (...args: any[]) => any>(
    action: T,
  ): [
    (...args: Parameters<T>) => Promise<ReturnType<T> | undefined>,
    { loading: boolean; error: Error | null },
  ];
}

declare module "@leeforge/fusion/middleware" {
  export function createMiddleware(
    fn: (ctx: any, next: () => Promise<void>) => Promise<any>,
  ): any;

  export function requireAuth(): any;
  export function requireAdmin(): any;
}

declare module "@leeforge/fusion/config" {
  export function defineConfig(config: any): any;
}

declare module "@leeforge/fusion/vite-plugin" {
  export function leeforgePlugin(): any;
}

declare module "*.tsx" {
  const content: string;
  export default content;
}

declare module "*.ts" {
  const content: string;
  export default content;
}
