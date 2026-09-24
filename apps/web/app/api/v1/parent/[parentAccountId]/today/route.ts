import { NextResponse } from 'next/server';
import { apiErrorStatus } from '@/lib/api-errors';
import { assertAdultProjectionBackendReady } from '@/lib/runtime-gates';
import { requireRequestAccountPrincipal } from '@/lib/request-principal';
import { adultProjectionRuntime } from '@/lib/adult-projections';

export async function GET(request: Request, ctx: { params: Promise<{ parentAccountId: string }> }) {
  try { assertAdultProjectionBackendReady();
    const principal = await requireRequestAccountPrincipal(request, 'PARENT'); const { parentAccountId } = await ctx.params; if (principal.accountId !== parentAccountId) throw new Error('ACCOUNT_CONTEXT_MISMATCH');
    const children = await adultProjectionRuntime.repo.listRelatedChildren(parentAccountId);
    if (children.length !== 1) return NextResponse.json({ code: children.length ? 'MULTIPLE_CHILDREN_UNSUPPORTED_IN_V1_SCREEN' : 'CHILD_NOT_FOUND' }, { status: 404 });
    if (!(await adultProjectionRuntime.repo.hasParentAccess(parentAccountId, children[0]))) return NextResponse.json({ code: 'FORBIDDEN' }, { status: 403 });
    return NextResponse.json(await adultProjectionRuntime.service.getParentToday(parentAccountId));
  } catch (error) {
    const status = error instanceof Error && (error.message === 'ACCOUNT_CONTEXT_MISMATCH' || error.message === 'DEV_ACCOUNT_PRINCIPAL_REQUIRED') ? 403 : 400;
    return NextResponse.json({ code: 'PARENT_TODAY_FAILED', message: error instanceof Error ? error.message : 'unknown error' }, { status });
  }
}
