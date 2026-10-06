// Local adapter fixture only; production ticket/CAS/revocation is tested by
// Platform's native-game-launch.test.js. Never point this at real services.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { randomUUID, randomBytes } from 'node:crypto';
import { once } from 'node:events';

const executable = process.argv[2];
if (!executable) throw new Error('Usage: node contract-harness.mjs <Development-game.exe> [Unreal-project.uproject]');
const project = process.argv[3];
let ticket, consumed, version, saveSlot, pendingEnds = 0;
const token = 'grs_' + randomBytes(32).toString('base64url');
const playerId = '0x' + 'b'.repeat(40), gameId = 'native-contract-config', buildSha256 = 'c'.repeat(64);
const server = createServer(async (req, res) => {
  let input = ''; for await (const chunk of req) { input += chunk; if (input.length > 300_000) { res.writeHead(413).end(); return; } }
  const body = input ? JSON.parse(input) : {};
  res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'private, no-store');
  const reply = (status, value) => { res.writeHead(status); res.end(JSON.stringify(value)); };
  if (req.url === '/api/game-runtime/v1/native/exchange') {
    if (consumed || body.ticket !== ticket || body.gameId !== gameId || body.buildSha256 !== buildSha256) return reply(401, {});
    consumed = true;
    return reply(200, { gameId, playerId, sessionId: token, scopes: ['identity:read', 'save:read', 'save:write', 'events:write'], expiresAt: new Date(Date.now() + 120_000).toISOString() });
  }
  if (req.headers.authorization !== `Bearer ${token}`) return reply(401, {});
  if (req.url === '/api/game-runtime/v1/session/me') return reply(200, { gameId, sessionId: token, player: { id: playerId, displayName: 'Fixture', avatar: null } });
  if (req.url === '/api/game-runtime/v1/session/end') { pendingEnds++; return reply(200, { success: true }); }
  if (req.url === '/api/game-runtime/v1/session/heartbeat') return reply(200, { expiresAt: new Date(Date.now() + 120_000).toISOString() });
  if (req.url === `/api/game-runtime/v1/saves/${saveSlot}`) {
    if (req.method === 'GET') return reply(200, { version, state: { level: 1 } });
    if (body.baseVersion !== version) return reply(409, { code: 'SAVE_CONFLICT', serverVersion: version, serverState: { level: 1 } });
    return reply(200, { version: ++version, state: body.state });
  }
  if (req.url === '/api/game-runtime/v1/events') return reply(200, { success: true, eventId: 'fixture' });
  reply(404, {});
});
server.listen(0, '127.0.0.1'); await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
const keep = new Set(['PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'TEMP', 'TMP', 'APPDATA', 'LOCALAPPDATA', 'USERPROFILE']);
const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => keep.has(name.toUpperCase())));
try {
  for (const scenario of ['authenticated', 'offline', 'standalone', 'disconnect', 'wrong-game']) {
    ticket = `glt_${randomUUID()}_${randomBytes(32).toString('base64url')}`; consumed = false; version = 0;
    saveSlot = 'contract-' + randomUUID();
    const expectation = scenario === 'wrong-game' ? 'authenticated' : scenario;
    // Public config overrides exercise non-default game/player/slot acceptance.
    // A hardcoded read of the default save slot must fail this fixture.
    const config = `-ini:Game:[GrottoContractFixture]:GameId=${gameId},[GrottoContractFixture]:ExpectedPlayerId=${playerId},[GrottoContractFixture]:SaveSlot=${saveSlot}`;
    const child = spawn(executable, [...(project ? [project, '-game'] : []), '-nullrhi', '-unattended', '-nosound', '-stdout', '-FullStdOutLogOutput', config, `-GrottoFixtureScenario=${expectation}`], { env, stdio: [scenario === 'standalone' ? 'ignore' : 'pipe', 'pipe', 'pipe'] });
    let output = ''; let disconnected = false;
    child.stdout.on('data', (chunk) => {
      output += chunk;
      if (scenario === 'disconnect' && !disconnected && output.includes('GROTTO_AUTH_READY')) { disconnected = true; child.stdin.destroy(); }
    });
    child.stderr.on('data', (chunk) => { output += chunk; });
    const timeout = setTimeout(() => child.kill(), 120_000);
    if (scenario === 'offline') child.stdin.destroy();
    else if (scenario !== 'standalone') child.stdin.write(JSON.stringify({ protocol: 'grotto-native-v1', apiBaseUrl: origin, gameId: scenario === 'wrong-game' ? 'wrong-game' : gameId, buildSha256, ticket }) + '\n');
    try {
      const [code] = await once(child, 'close');
      if (scenario === 'wrong-game') {
        assert.equal(code, 1, 'wrong-game: fixture did not report failed authentication');
        assert.ok(output.includes('GROTTO_CONTRACT_FAIL authenticated') && !output.includes('GROTTO_CONTRACT_PASS'), 'wrong-game: incorrect failure receipt');
        assert.equal(consumed, false, 'wrong-game: invalid frame reached exchange');
      } else {
        assert.equal(code, 0, `${scenario}: game failed`);
        assert.ok(output.includes(`GROTTO_CONTRACT_PASS ${scenario}`) && !output.includes('GROTTO_CONTRACT_FAIL'), `${scenario}: no passing receipt`);
      }
      assert.ok(!output.includes(ticket) && !output.includes(token), 'Credential appeared in game output');
      console.log(`PASS ${scenario}`);
    } finally { clearTimeout(timeout); if (child.exitCode === null) child.kill(); }
  }
  assert.ok(pendingEnds > 0, 'Session end was not observed');
} finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
