# Phase 12 — Transactional PostgreSQL Learning Runtime

## Goal

Move the authoritative Learning Runtime write path from development-only in-memory persistence to a transaction-capable Supabase/PostgreSQL boundary without weakening the existing Auth/RLS model.

## Delivered

1. `0031_learning_runtime_contract_alignment.sql`
   - persists `confidence`, `uncertainty`, `review_need`, `recovery_need` on `learning_states`;
   - persists `source_attempt_id` on `learning_decisions`;
   - adds integrity/range checks and causal indexes.

2. `0032_runtime_transactional_rpc.sql`
   - `runtime_start_session`
   - `runtime_create_encounter`
   - `runtime_submit_attempt`
   - all are `SECURITY DEFINER` with a locked `search_path`;
   - public execution is revoked and `authenticated` execution is granted explicitly;
   - learner identity is derived from `auth.uid()`;
   - runtime attempt commit persists attempt, answers, evidence, Learning State, Station Check, Decision, Plan, encounter completion and session progression in one PostgreSQL transaction.

3. `apps/web/lib/supabase-http.ts`
   - adds a typed Supabase REST RPC helper.

4. `apps/web/lib/learning-runtime-production.ts`
   - production adapter for session creation, encounter creation and atomic attempt submission;
   - converts PostgreSQL row naming to canonical TypeScript contracts.

5. Production API switching
   - authenticated requests with a Supabase access token use the PostgreSQL adapter;
   - development-only requests without a token retain the in-memory vertical-slice runtime.

## Runtime invariants enforced in SQL

- client does not supply authoritative Learning Identity;
- attempt requires an active session;
- encounter must belong to that session;
- mastery check requires exactly five answers;
- 4/5 is a qualifying Check;
- Station Pass requires two qualifying Checks from two distinct Sessions;
- idempotency is keyed by `client_idempotency_key`;
- inactive/completed runtime objects cannot be advanced through the write path;
- relationship context is constrained by platform ownership/active relationship access;
- direct authenticated table writes remain blocked by migration `0030`.

## Verification performed in this environment

PASS:
- Phase 12 static verification
- previous remediation static verification
- Phase 11 Auth boundary verification
- 5/5 Learning Runtime tests
- migration numbering is contiguous `0001..0032`

NOT claimed:
- execution of migrations against a real PostgreSQL/Supabase project;
- remote Supabase RPC invocation with live Auth credentials;
- full Next.js TypeScript build (the environment's dependency tree is incomplete after prior npm network timeout).

## Gate status

`Learning Runtime code path`: READY FOR SUPABASE-SIDE VERIFICATION

`Production Pilot`: NOT YET CLEARED

The remaining gate is to apply `0031` and `0032` to a real Supabase project, exercise Auth → RPC → RLS/transaction behavior, and then run a real Station 01 end-to-end scenario.
