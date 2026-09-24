import { getSupabaseAuthUser, supabaseRestSelect } from './supabase-http';

export type PrincipalMode = 'DEV_ONLY' | 'SUPABASE_AUTH';

export interface RequestPrincipal {
  mode: PrincipalMode;
  accountId: string;
  learningIdentityId: string;
  accessToken?: string;
  authUserId: string;
}

export interface AccountPrincipal {
  mode: PrincipalMode;
  accountId: string;
  authUserId: string;
  accessToken?: string;
  roles: string[];
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

function devLearningIdentity(request: Request): RequestPrincipal {
  if (process.env.NODE_ENV === 'production') throw new Error('AUTH_REQUIRED');
  const learningIdentityId = request.headers.get('x-dev-learning-identity-id')?.trim();
  if (!learningIdentityId) throw new Error('DEV_PRINCIPAL_REQUIRED');
  const accountId = request.headers.get('x-dev-account-id')?.trim() || learningIdentityId;
  return { mode: 'DEV_ONLY', accountId, learningIdentityId, authUserId: accountId };
}

function devAccount(request: Request): AccountPrincipal {
  if (process.env.NODE_ENV === 'production') throw new Error('AUTH_REQUIRED');
  const accountId = request.headers.get('x-dev-account-id')?.trim();
  if (!accountId) throw new Error('DEV_ACCOUNT_PRINCIPAL_REQUIRED');
  const roles = (request.headers.get('x-dev-roles') ?? '').split(',').map((x) => x.trim()).filter(Boolean);
  return { mode: 'DEV_ONLY', accountId, authUserId: accountId, roles };
}

async function authAccount(request: Request): Promise<AccountPrincipal> {
  const token = bearerToken(request);
  if (!token) throw new Error('AUTH_BEARER_REQUIRED');
  const user = await getSupabaseAuthUser(token);
  const roles = await supabaseRestSelect<{ role: string }>(token, 'account_roles', {
    account_id: `eq.${user.id}`,
    status: 'eq.ACTIVE',
    select: 'role',
  });
  return {
    mode: 'SUPABASE_AUTH',
    accountId: user.id,
    authUserId: user.id,
    accessToken: token,
    roles: roles.map((x) => x.role),
  };
}

async function authLearning(request: Request): Promise<RequestPrincipal> {
  const account = await authAccount(request);
  if (!account.accessToken) throw new Error('AUTH_BEARER_REQUIRED');
  const identities = await supabaseRestSelect<{ id: string }>(account.accessToken, 'learning_identities', {
    account_id: `eq.${account.accountId}`,
    status: 'eq.ACTIVE',
    select: 'id',
    limit: '2',
  });
  if (identities.length !== 1) throw new Error(identities.length === 0 ? 'LEARNING_IDENTITY_NOT_FOUND' : 'LEARNING_IDENTITY_NOT_UNIQUE');
  const learningIdentityId = identities[0]?.id;
  if (!learningIdentityId) throw new Error('LEARNING_IDENTITY_NOT_FOUND');
  return {
    mode: account.mode,
    accountId: account.accountId,
    authUserId: account.authUserId,
    accessToken: account.accessToken,
    learningIdentityId,
  };
}

export async function requireRequestPrincipal(request: Request): Promise<RequestPrincipal> {
  if (process.env.NODE_ENV !== 'production' && request.headers.get('x-dev-learning-identity-id')) return devLearningIdentity(request);
  return authLearning(request);
}

export async function requireRequestAccountPrincipal(request: Request, requiredRole?: string): Promise<AccountPrincipal> {
  const principal = process.env.NODE_ENV !== 'production' && request.headers.get('x-dev-account-id')
    ? devAccount(request)
    : await authAccount(request);
  if (requiredRole && !principal.roles.includes(requiredRole) && !principal.roles.includes('ADMIN')) {
    throw new Error('ROLE_REQUIRED');
  }
  return principal;
}

export function assertBodyIdentityMatches(principal: RequestPrincipal, bodyLearningIdentityId?: string): string {
  if (bodyLearningIdentityId && bodyLearningIdentityId !== principal.learningIdentityId) throw new Error('IDENTITY_CONTEXT_MISMATCH');
  return principal.learningIdentityId;
}

export function assertPathAccountMatches(principal: AccountPrincipal, accountId: string): void {
  if (accountId !== principal.accountId) throw new Error('ACCOUNT_CONTEXT_MISMATCH');
}
