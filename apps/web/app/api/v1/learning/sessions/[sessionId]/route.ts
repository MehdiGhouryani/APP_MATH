import { NextResponse } from 'next/server';
import { requireRequestPrincipal } from '@/lib/request-principal';

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
  request: Request,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  try {
    await requireRequestPrincipal(request);
    const { sessionId } = await ctx.params;
    return NextResponse.json(
      { code: 'SESSION_STATUS_UNAVAILABLE', id: sessionId, message: 'وضعیت جلسه از مخزن معتبر هنوز در دسترس نیست.' },
      { status: 503 }
    );
  } catch {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: 'ورود الزامی است.' }, { status: 401 });
  }
}
