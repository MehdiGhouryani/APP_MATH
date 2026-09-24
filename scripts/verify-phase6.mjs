import fs from 'node:fs';
import path from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const required = [
  'apps/mobile/app/station/[stationId].tsx',
  'apps/mobile/src/station/StationFlow.tsx',
  'apps/mobile/src/station/runtimeApi.ts',
  'content/dev-packs/g1-st01-v1/content.json',
  'docs/PHASE_6_STATION_01_CHILD_EXPERIENCE.md',
  'docs/API_CONTRACT_PHASE_6.md',
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`MISSING:${file}`);
}
const source = fs.readFileSync(path.join(root, 'apps/mobile/src/station/StationFlow.tsx'), 'utf8');
for (const marker of ['PatternGame', 'CountGame', 'RECOVERY', 'RECHECK', 'stationPass', 'beginFreshCheckEncounter']) {
  if (!source.includes(marker)) throw new Error(`MISSING_MARKER:${marker}`);
}
if (/\bUnity\b/.test(source)) throw new Error('UNITY_REFERENCE_IN_STATION_UI');
console.log('Phase 6 static verification: PASS');
