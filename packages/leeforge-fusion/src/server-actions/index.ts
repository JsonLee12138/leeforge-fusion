export interface ServerActionOptions {
  name?: string;
  middleware?: any[];
}

export function createAction<T extends (...args: any[]) => any>(
  fn: T,
  options: ServerActionOptions = {},
): T {
  const actionName = options.name || fn.name || "anonymous";

  const proxyFn = ((...args: any[]) => {
    if (typeof window === "undefined") {
      return fn(...args);
    }

    return fetch("/api/__server_action__", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: actionName,
        args,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server action failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }
        return result.data;
      });
  }) as T;

  (proxyFn as any).__serverAction = true;
  (proxyFn as any).__actionName = actionName;

  return proxyFn;
}

export function isServerAction(fn: any): boolean {
  return fn && fn.__serverAction === true;
}

export function getServerActionName(fn: any): string | undefined {
  return fn && fn.__actionName;
}
