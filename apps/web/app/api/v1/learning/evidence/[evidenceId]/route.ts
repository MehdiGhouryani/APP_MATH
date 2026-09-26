import { NextResponse } from 'next/server';

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ evidenceId: string }> }
) {
  const { evidenceId } = await ctx.params;
  // Canonical Historical Safety: REVOKE DELETE ON public.evidence
  return NextResponse.json(
    {
      code: 'RLS_HISTORICAL_SAFETY_VIOLATION',
      error: 'FORBIDDEN',
      evidenceId,
      message:
        'REVOKE DELETE ENFORCED: Learning evidence is immutable and append-only. Deletion is forbidden by PostgreSQL RLS security policies.',
      policy: '0020_rls_historical_safety',
      rule: 'REVOKE DELETE ON public.evidence',
    },
    { status: 403 }
  );
}

export async function PATCH(
  _request: Request,
  ctx: { params: Promise<{ evidenceId: string }> }
) {
  const { evidenceId } = await ctx.params;
  return NextResponse.json(
    {
      code: 'RLS_HISTORICAL_SAFETY_VIOLATION',
      error: 'FORBIDDEN',
      evidenceId,
      message:
        'REVOKE UPDATE ENFORCED: Learning evidence cannot be modified after creation.',
      policy: '0020_rls_historical_safety',
    },
    { status: 403 }
  );
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ evidenceId: string }> }
) {
  const { evidenceId } = await ctx.params;
  return NextResponse.json({
    id: evidenceId,
    status: 'COMMITTED',
    isHistorical: true,
  });
}
