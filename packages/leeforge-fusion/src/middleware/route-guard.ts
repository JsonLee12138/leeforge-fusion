import { redirect } from "./redirect";

export interface LoaderContext {
  params: Record<string, string>;
  user?: any;
  request: Request;
  [key: string]: any;
}

export type GuardFunction = (context: LoaderContext) => Promise<void> | void;

export function defineGuard(guard: GuardFunction): GuardFunction {
  return async (context: LoaderContext) => {
    const result = guard(context);
    if (result instanceof Promise) {
      await result;
    }
  };
}

export const requireAuth = defineGuard((context) => {
  if (!context.user) {
    throw redirect("/login");
  }
});

export const requireAdmin = defineGuard((context) => {
  if (!context.user || context.user.role !== "admin") {
    throw redirect("/unauthorized");
  }
});

export const requireGuest = defineGuard((context) => {
  if (context.user) {
    throw redirect("/dashboard");
  }
});

export function createGuardChain(...guards: GuardFunction[]): GuardFunction {
  return async (context: LoaderContext) => {
    for (const guard of guards) {
      await guard(context);
    }
  };
}
