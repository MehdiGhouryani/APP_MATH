import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const policy = read('packages/learning-runtime/src/policies.ts');
assert.match(policy, /STATION_CHECK_TOTAL_ITEMS = 5/);
assert.match(policy, /STATION_CHECK_REQUIRED_CORRECT = 4/);
assert.match(policy, /distinctSessions\.size >= 2/);

const evaluator = read('packages/learning-runtime/src/evaluator.ts');
assert.match(evaluator, /count \+ \(deepEqual\(answer, expectedAnswer\) \? 1 : 0\)/);

const engine = read('packages/learning-runtime/src/engine.ts');
assert.match(engine, /MASTERY_CHECK_REQUIRES_FIVE_ANSWERS/);
assert.match(engine, /isQualifyingCheck/);
assert.match(engine, /getDecisionByAttemptId/);

const principal = read('apps/web/lib/request-principal.ts');
assert.match(principal, /DEV_PRINCIPAL_REQUIRED/);
assert.match(principal, /DEV_ACCOUNT_PRINCIPAL_REQUIRED/);

const migration = read('supabase/migrations/0028_security_hardening_and_runtime_invariants.sql');
assert.match(migration, /relationships_admin_write/);
assert.match(migration, /revoke insert, update, delete on public.station_check_results/);

const contentAccess = read('supabase/migrations/0029_content_package_assignment_access.sql');
assert.match(contentAccess, /assignment_required_packages/);
assert.match(contentAccess, /can_access_learning_identity\(ai\.learning_identity_id\)/);

const runtimeLockdown = read('supabase/migrations/0030_runtime_client_write_lockdown.sql');
for (const table of ['sessions','encounters','attempts','answers','evidence','learning_states','learning_decisions','learning_plans','station_check_results']) {
  assert.match(runtimeLockdown, new RegExp(`revoke insert, update, delete on public\.${table} from authenticated`));
}


const stationRuntime = read('apps/mobile/src/station/StationFlow.tsx');
assert.match(stationRuntime, /G1-ST01-E09.*beginFreshCheckEncounter/s);
assert.match(stationRuntime, /outcome\.selectedStep === 'RECHECK'.*beginFreshCheckEncounter\(target, 'RECHECK'\)/s);

const contentManager = read('apps/mobile/src/content/ContentManager.ts');
assert.match(contentManager, /downloadPackage\(pkg, 3, learningIdentityId\)/);

const packageRoute = read('apps/web/app/api/v1/content/packages/[packageId]/route.ts');
assert.match(packageRoute, /checkEntitlement\(packageId, principal\.learningIdentityId\)/);

const teacherStudentRoute = read('apps/web/app/api/v1/teacher/[teacherAccountId]/students/[learningIdentityId]/route.ts');
assert.equal((teacherStudentRoute.match(/const principal = await requireRequestAccountPrincipal\(request, 'TEACHER'\);/g) ?? []).length, 1);

const mobileSyncTransport = read('apps/mobile/src/sync/MobileSyncManager.ts');
assert.match(mobileSyncTransport, /x-dev-learning-identity-id/);
const fileQueue = read('apps/mobile/src/sync/FileSyncQueueStore.ts');
assert.match(fileQueue, /status === 'SYNCING'/);
assert.match(fileQueue, /findIndex\(\(x\) => x\.id === action\.id\)/);
const runtimeApi = read('apps/mobile/src/station/runtimeApi.ts');
assert.match(runtimeApi, /syncManager\.enqueue/);
assert.match(runtimeApi, /semanticEvent: 'SYNC_QUEUED'/);


const assignmentCreateRoute = read('apps/web/app/api/v1/assignments/route.ts');
assert.match(assignmentCreateRoute, /listClassesForTeacher\(principal\.accountId\)/);
assert.match(assignmentCreateRoute, /LEARNER_OUTSIDE_CLASS/);

const assignmentRoute = read('apps/web/app/api/v1/assignments/[assignmentId]/route.ts');
assert.match(assignmentRoute, /listClassesForTeacher\(principal\.accountId\)/);
assert.match(assignmentRoute, /listLearnersInClass\(assignment\.classId\)/);

const recheckRoute = read('apps/web/app/api/v1/assignment-instances/[instanceId]/recheck/route.ts');
assert.match(recheckRoute, /listClassesForTeacher\(principal\.accountId\)/);



const manifestTest = read('e2e/web/critical-path.spec.ts');
assert.doesNotMatch(manifestTest, /body\.packages/);
assert.match(manifestTest, /body\.current/);

const pkg = JSON.parse(read('content/dev-packs/g1-st01-v1/content.json'));
for (const id of ['G1-ST01-E07','G1-ST01-E08','G1-ST01-E10']) {
  const encounter = pkg.encounters.find((x) => x.contentVersionId === id);
  assert.deepEqual(encounter.checkContract, { requiredCorrect: 4, totalItems: 5, separateSession: true });
}

console.log('[PASS] remediation static verification');
