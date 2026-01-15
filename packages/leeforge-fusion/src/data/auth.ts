export interface AuthConfig {
  token?: string;
  user?: any;
}

export function getAuthHeaders(config: AuthConfig): Record<string, string> {
  if (!config.token) return {};
  return { Authorization: `Bearer ${config.token}` };
}

export function withAuthHeaders(
  config: AuthConfig,
  headers: Record<string, string> = {},
): Record<string, string> {
  return {
    ...headers,
    ...getAuthHeaders(config),
  };
}
