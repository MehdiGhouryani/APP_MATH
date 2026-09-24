import { NextResponse } from 'next/server';
import { assertAssignmentBackendReady } from '@/lib/runtime-gates';
import { assertAdultProjectionBackendReady } from '@/lib/runtime-gates';
import { requireRequestPrincipal } from '@/lib/request-principal';
import { assignmentRuntime } from '@/lib/assignment-runtime';

export async function POST(request: Request, ctx: { params: Promise<{ instanceId: string }> }) {
  try { assertAssignmentBackendReady();
    const principal = await requireRequestPrincipal(request);
    const { instanceId } = await ctx.params;
    const instance = await assignmentRuntime.repo.getInstance(instanceId);
    if (!instance) return NextResponse.json({ code: 'INSTANCE_NOT_FOUND' }, { status: 404 });
    if (instance.learningIdentityId !== principal.learningIdentityId) return NextResponse.json({ code: 'FORBIDDEN' }, { status: 403 });
    const body = await request.json() as { completed?: boolean; needsRecheck?: boolean; payload?: Record<string, unknown> };
    if (typeof body.completed !== 'boolean') return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'completed is required' }, { status: 400 });
    const result = await assignmentRuntime.service.applyLearningOutcome(instanceId, {
      completed: body.completed,
      needsRecheck: body.needsRecheck,
      payload: body.payload,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ code: 'ASSIGNMENT_OUTCOME_FAILED', message }, { status: 400 });
  }
}
