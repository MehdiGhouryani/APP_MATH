import { NextResponse } from 'next/server';

export async function DELETE(_request: Request) {
  return NextResponse.json(
    {
      code: 'RLS_HISTORICAL_SAFETY_VIOLATION',
      error: 'FORBIDDEN',
      message:
        'REVOKE DELETE ENFORCED: Bulk or individual deletion of learning evidence is strictly prohibited by PostgreSQL RLS security policies.',
      policy: '0020_rls_historical_safety',
      rule: 'REVOKE DELETE ON public.evidence',
    },
    { status: 403 }
  );
}

export async function GET(_request: Request) {
  return NextResponse.json({
    table: 'public.evidence',
    policy: 'APPEND_ONLY',
    historicalSafety: 'ACTIVE',
  });
}
