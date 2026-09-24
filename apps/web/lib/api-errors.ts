export function apiErrorStatus(error: unknown): number {
  const code = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
  if (code === 'AUTH_BEARER_REQUIRED' || code === 'AUTH_INVALID_TOKEN' || code === 'AUTH_PROVIDER_ERROR' || code === 'AUTH_REQUIRED' || code === 'DEV_PRINCIPAL_REQUIRED' || code === 'DEV_ACCOUNT_PRINCIPAL_REQUIRED' || code.startsWith('SUPABASE_RPC_401') || code.startsWith('SUPABASE_REST_401')) return 401;
  if (code === 'ROLE_REQUIRED' || code.endsWith('CONTEXT_MISMATCH') || code === 'FORBIDDEN' || code === 'FORBIDDEN_CLASS' || code === 'LEARNER_OUTSIDE_CLASS' || code === 'RELATIONSHIP_CONTEXT_FORBIDDEN' || code === 'CLIENT_INSTALLATION_FORBIDDEN' || code.startsWith('SUPABASE_RPC_403') || code.startsWith('SUPABASE_REST_403')) return 403;
  if (code.endsWith('NOT_FOUND') || code === 'INSTANCE_NOT_FOUND' || code === 'ASSIGNMENT_NOT_FOUND') return 404;
  if (code === 'RUNTIME_BACKEND_NOT_CONFIGURED' || code === 'ADULT_BACKEND_NOT_CONFIGURED' || code === 'ASSIGNMENT_BACKEND_NOT_CONFIGURED' || code === 'CONTENT_BACKEND_NOT_CONFIGURED' || code.startsWith('SUPABASE_RPC_5') || code.startsWith('SUPABASE_REST_5') || code === 'ASSIGNMENT_BACKEND_NOT_CONFIGURED' || code === 'CONTENT_BACKEND_NOT_CONFIGURED') return 503;
  return 400;
}
