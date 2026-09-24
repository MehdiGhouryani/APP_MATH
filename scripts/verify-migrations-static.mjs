import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'supabase', 'migrations');
const files = fs.readdirSync(dir).filter((x) => /^\d{4}_.+\.sql$/.test(x)).sort();
const failures = [];
const numbers = files.map((x) => Number(x.slice(0, 4)));

for (let i = 0; i < numbers.length; i += 1) {
  const expected = i + 1;
  if (numbers[i] !== expected) failures.push(`MIGRATION_SEQUENCE_GAP_OR_DUPLICATE:expected=${String(expected).padStart(4, '0')}:actual=${String(numbers[i]).padStart(4, '0')}`);
}

for (const file of files) {
  const source = fs.readFileSync(path.join(dir, file), 'utf8');
  const dollars = (source.match(/\$\$/g) ?? []).length;
  if (dollars % 2 !== 0) failures.push(`UNBALANCED_DOLLAR_QUOTES:${file}`);
  if (/create\s+policy\s+if\s+not\s+exists/i.test(source)) failures.push(`UNSUPPORTED_POLICY_IF_NOT_EXISTS:${file}`);
  if (/alter\s+policy\s+if\s+not\s+exists/i.test(source)) failures.push(`UNSUPPORTED_ALTER_POLICY_IF_NOT_EXISTS:${file}`);
}

const latest = fs.readFileSync(path.join(dir, '0044_runtime_check_group_ordering.sql'), 'utf8');
if (!/create\s+or\s+replace\s+function\s+public\.runtime_submit_attempt/i.test(latest)) failures.push('0044_MUST_FORWARD_PATCH_RUNTIME_SUBMIT_ATTEMPT');
if (!/v_check_group\s*:=\s*case\s+when\s+v_encounter\.learning_role='MASTERY_CHECK'/s.test(latest)) failures.push('0044_MUST_RESOLVE_CHECK_GROUP_BEFORE_RUNTIME_WRITES');

if (failures.length) {
  console.error('MIGRATION_STATIC_GUARD: BLOCKED');
  console.error(failures.join('\n'));
  process.exit(2);
}

console.log(`MIGRATION_STATIC_GUARD: PASS (${files.length} migrations, latest=${files.at(-1)})`);
