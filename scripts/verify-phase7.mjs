import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'packages/assignment-runtime/src/service.ts',
  'packages/assignment-runtime/src/types.ts',
  'supabase/migrations/0024_assignment_targets_recheck.sql',
  'apps/web/app/api/v1/assignments/route.ts',
  'apps/web/app/api/v1/assignments/[assignmentId]/route.ts',
  'apps/web/app/api/v1/assignment-instances/[instanceId]/recheck/route.ts',
  'apps/web/app/api/v1/assignment-instances/[instanceId]/outcome/route.ts',
  'apps/web/app/api/v1/learning-identities/[learningIdentityId]/assignments/route.ts',
  'apps/web/app/teacher/assignments/page.tsx',
  'apps/mobile/app/assignments.tsx',
  'docs/PHASE_7_TEACHER_ASSIGNMENT_SLICE.md',
  'docs/API_CONTRACT_PHASE_7.md',
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing ${rel}`);
}
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/0024_assignment_targets_recheck.sql'), 'utf8');
for (const marker of ['assignment_targets', 'assignment_rechecks', 'adaptation_mode', 'completion_rule']) {
  if (!migration.includes(marker)) throw new Error(`Migration marker missing: ${marker}`);
}
const service = fs.readFileSync(path.join(root, 'packages/assignment-runtime/src/service.ts'), 'utf8');
for (const marker of ['createDraft', 'publish', 'listForLearner', 'applyLearningOutcome', 'requestRecheck']) {
  if (!service.includes(`async ${marker}`)) throw new Error(`Service method missing: ${marker}`);
}
console.log('PHASE7_STATIC_VERIFICATION_PASS');
