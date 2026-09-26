import { NextResponse } from 'next/server';

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await ctx.params;
  return NextResponse.json(
    {
      code: 'RLS_HISTORICAL_SAFETY_VIOLATION',
      error: 'FORBIDDEN',
      sessionId,
      message:
        'REVOKE DELETE ENFORCED: Learning sessions cannot be deleted. History is append-only.',
      policy: '0020_rls_historical_safety',
      rule: 'REVOKE DELETE ON public.sessions',
    },
    { status: 403 }
  );
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await ctx.params;
  return NextResponse.json({
    id: sessionId,
    status: 'ACTIVE',
  });
}
