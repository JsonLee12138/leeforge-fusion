export interface RedirectError {
  type: "redirect";
  to: string;
  status?: number;
}

export function redirect(to: string, status?: number): never {
  const error: RedirectError = {
    type: "redirect",
    to,
    status: status || 302,
  };
  throw error;
}

export function isRedirectError(error: any): error is RedirectError {
  return error && error.type === "redirect";
}

export function getRedirectLocation(error: RedirectError): string {
  return error.to;
}

export function getRedirectStatus(error: RedirectError): number {
  return error.status || 302;
}
