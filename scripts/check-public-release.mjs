// Read-only publication check. Never copies private monorepo history to the public repository.
import { loadJson, manifestPath, digest } from './skill-catalog.mjs';
const local = loadJson(manifestPath);
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--base')) throw new Error('Usage: node scripts/check-public-release.mjs [--base https://.../]');
const base = new URL(args[1] || 'https://raw.githubusercontent.com/snapss-dev/grotto-skills/main/');
if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) throw new Error('Expected an HTTPS repository root without credentials/query/fragment');
if (!base.pathname.endsWith('/')) base.pathname += '/';
async function read(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000), redirect: 'error' });
  if (!response.ok) throw new Error(path + ': HTTP ' + response.status);
  return (await response.text()).replaceAll('\r\n', '\n');
}
const remote = JSON.parse(await read('relevance/manifest.json'));
if (JSON.stringify(remote) !== JSON.stringify(local)) throw new Error('Public skill catalog differs from this checkout; publish the complete generated release.');
let count = 0;
for (const skill of local.skills) {
  const results = await Promise.allSettled(Object.entries(skill.resources).map(async ([path, expected]) => {
    if ('sha256:' + digest(await read('skills/' + skill.name + '/' + path)) !== expected) throw new Error(skill.name + '/' + path + ': release hash mismatch');
    count++;
  }));
  const failures = results.filter(result => result.status === 'rejected');
  if (failures.length) throw new AggregateError(failures.map(result => result.reason), 'Public resources differ');
}
console.log('Public release verified: ' + local.revision + ', ' + local.skills.length + ' skills, ' + count + ' resources.');
