import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'packages/contracts/src/animation.ts',
  'apps/mobile/src/animation/AnimationController.ts',
  'apps/mobile/src/animation/useAnimationController.ts',
  'apps/mobile/src/animation/semanticEvents.ts',
  'apps/mobile/src/components/AnimatedCharacter.tsx',
  'apps/mobile/src/components/SemanticAnimationDemo.tsx',
  'apps/mobile/app/animation.tsx',
  'docs/PHASE_4_ANIMATION_RUNTIME.md',
  'docs/ADR_0002_SEMANTIC_ANIMATION_EVENTS.md',
  'docs/REVISION_NOTES_PHASE_4.md',
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing: ${file}`);
}
const source = fs.readFileSync(path.join(root, 'packages/contracts/src/animation.ts'), 'utf8');
if (!source.includes("'STATION_PASS'")) throw new Error('Semantic event contract incomplete');
if (!source.includes("'REWARD_GRANTED'")) throw new Error('Semantic event contract incomplete');
const files = fs.readdirSync(path.join(root, 'supabase/migrations'));
if (files.length < 22) throw new Error('Expected Phase 3 migrations to remain in snapshot');
console.log('[PASS] Phase 4 static verification');
