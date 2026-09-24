let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token?.trim() || null;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getAuthHeaders(): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}
