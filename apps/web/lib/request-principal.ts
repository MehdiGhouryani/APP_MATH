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
  const learningIdentityId =
    request.headers.get('x-dev-learning-identity-id')?.trim() || 'child-dev-01';
  const accountId =
    request.headers.get('x-dev-account-id')?.trim() || 'child-account-dev-01';
  return { mode: 'DEV_ONLY', accountId, learningIdentityId, authUserId: accountId };
}

function devAccount(request: Request, defaultRole = 'PARENT'): AccountPrincipal {
  const accountId =
    request.headers.get('x-dev-account-id')?.trim() ||
    (defaultRole === 'TEACHER' ? 'teacher-dev-01' : 'parent-dev-01');
  const customRoles = request.headers.get('x-dev-roles');
  const roles = customRoles
    ? customRoles.split(',').map((x) => x.trim()).filter(Boolean)
    : ['PARENT', 'TEACHER', 'ADMIN', 'CHILD'];
  return { mode: 'DEV_ONLY', accountId, authUserId: accountId, roles };
}

async function authAccount(request: Request): Promise<AccountPrincipal> {
  const token = bearerToken(request);
  if (!token) {
    // If no bearer token in development, fallback to dev account
    if (process.env.NODE_ENV !== 'production') {
      return devAccount(request);
    }
    throw new Error('AUTH_BEARER_REQUIRED');
  }
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
  if (process.env.NODE_ENV !== 'production' && !bearerToken(request)) {
    return devLearningIdentity(request);
  }
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
  if (process.env.NODE_ENV !== 'production') {
    return devLearningIdentity(request);
  }
  return authLearning(request);
}

export async function requireRequestAccountPrincipal(request: Request, requiredRole?: string): Promise<AccountPrincipal> {
  const principal = process.env.NODE_ENV !== 'production'
    ? devAccount(request, requiredRole)
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
  // Allow matched dev account or admin override in dev
  if (accountId !== principal.accountId && !principal.roles.includes('ADMIN') && process.env.NODE_ENV === 'production') {
    throw new Error('ACCOUNT_CONTEXT_MISMATCH');
  }
}
