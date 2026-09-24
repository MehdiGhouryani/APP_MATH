import { NextResponse } from 'next/server';
import { assertAssignmentBackendReady } from '@/lib/runtime-gates';
import { requireRequestPrincipal } from '@/lib/request-principal';
import { assignmentRuntime } from '@/lib/assignment-runtime';

export async function GET(request: Request, ctx: { params: Promise<{ learningIdentityId: string }> }) {
  try {
    assertAssignmentBackendReady();
    const principal = await requireRequestPrincipal(request);
  const { learningIdentityId } = await ctx.params;
  if (principal.learningIdentityId !== learningIdentityId) return NextResponse.json({ code: 'IDENTITY_CONTEXT_MISMATCH' }, { status: 403 });
  const items = await assignmentRuntime.service.listForLearner(learningIdentityId);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ code: 'LEARNER_ASSIGNMENTS_FAILED', message: error instanceof Error ? error.message : 'Unknown error' }, { status: error instanceof Error && error.message === 'IDENTITY_CONTEXT_MISMATCH' ? 403 : 400 });
  }
}
