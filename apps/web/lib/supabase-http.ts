export class SupabaseConfigError extends Error {
  constructor(message = 'SUPABASE_CONFIG_MISSING') {
    super(message);
    this.name = 'SupabaseConfigError';
  }
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new SupabaseConfigError();
  return { url, anonKey };
}

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  role?: string;
  aud?: string;
};

export async function getSupabaseAuthUser(accessToken: string): Promise<SupabaseAuthUser> {
  const { url, anonKey } = config();
  const response = await fetch(`${url}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'AUTH_INVALID_TOKEN' : 'AUTH_PROVIDER_ERROR');
  }
  const user = await response.json() as SupabaseAuthUser;
  if (!user.id) throw new Error('AUTH_USER_ID_MISSING');
  return user;
}

export async function supabaseRestSelect<T>(
  accessToken: string,
  table: string,
  query: Record<string, string>,
): Promise<T[]> {
  const { url, anonKey } = config();
  const params = new URLSearchParams(query);
  const response = await fetch(`${url}/rest/v1/${table}?${params.toString()}`, {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`SUPABASE_REST_${response.status}`);
  }
  return await response.json() as T[];
}

export async function supabaseRpc<T>(
  accessToken: string,
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { url, anonKey } = config();
  const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) {
    let detail = '';
    try { detail = await response.text(); } catch { /* preserve status-only fallback */ }
    const suffix = detail ? `:${detail.slice(0, 240)}` : '';
    throw new Error(`SUPABASE_RPC_${response.status}${suffix}`);
  }
  return await response.json() as T;
}
