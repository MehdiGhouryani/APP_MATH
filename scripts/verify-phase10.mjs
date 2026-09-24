import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'playwright.config.ts',
  'e2e/web/critical-path.spec.ts',
  'e2e/web/api-critical-path.spec.ts',
  'scripts/performance/phase10-performance.mjs',
  'docs/PHASE_10_E2E_PERFORMANCE_PILOT.md',
  'docs/API_CONTRACT_PHASE_10.md',
  'docs/PILOT_RUNBOOK_PHASE_10.md',
  'docs/REVISION_NOTES_PHASE_10.md',
  'docs/SNAPSHOT_MANIFEST_PHASE_10.json',
];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing ${rel}`);
}
const specs = [
  fs.readFileSync(path.join(root, 'e2e/web/critical-path.spec.ts'), 'utf8'),
  fs.readFileSync(path.join(root, 'e2e/web/api-critical-path.spec.ts'), 'utf8'),
];
for (const source of specs) {
  for (const marker of ['test(', 'expect(', "'/api/v1/"]) {
    if (!source.includes(marker)) throw new Error(`E2E contract marker missing: ${marker}`);
  }
}
const perf = fs.readFileSync(path.join(root, 'scripts/performance/phase10-performance.mjs'), 'utf8');
for (const marker of ['FRAME_BUDGET_MS', 'MAX_SYNC_BATCH', 'CACHE_BUDGET_BYTES', 'PHASE10_SYNTHETIC_PERFORMANCE_PASS']) {
  if (!perf.includes(marker)) throw new Error(`Performance marker missing: ${marker}`);
}
const docs = fs.readFileSync(path.join(root, 'docs/PHASE_10_E2E_PERFORMANCE_PILOT.md'), 'utf8');
for (const marker of ['60 FPS', '16.67 ms', 'low-end Android', 'Pilot', 'No Unity']) {
  if (!docs.includes(marker)) throw new Error(`Phase 10 documentation marker missing: ${marker}`);
}
console.log('PHASE10_STATIC_VERIFICATION_PASS');
