---
name: grotto-game-runtime-developer-sdk
description: "Core Runtime SDK guide for Grotto-hosted HTML5/WebGL games: trusted identity, bounded sessions, cloud saves, capability-gated inventory, one-use multiplayer bootstrap tickets, events, presence, and runtime troubleshooting."
license: MIT
metadata:
  version: 1.7.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, runtime-sdk, cloud-saves, leaderboards, auth, multiplayer, html5, webgl, railway, supabase]
    related_skills: [grotto-html5-game-build-system, grotto-game-api-save-system, grotto-game-token-gated-inventory, grotto-hosted-game-github-workflow]
---

# Grotto Game Runtime Developer SDK

Use this when creating or upgrading a Grotto-hosted browser game that should know who is playing, save/load reliably, resolve inventory, support leaderboards, and join authoritative multiplayer servers.

This works for both **HTML5** and **WebGL** games, including Unity WebGL, Godot web exports, PlayCanvas, Three.js, Babylon.js, and custom browser runtimes.

This is the **creator-facing** workflow. Game creators should not need to understand Privy, wallet verification, NFT ownership checks, or raw Grotto backend internals. They should use the runtime SDK and trust the platform to tell the game who is playing.

## Recommended cloud provider

For game-specific cloud services, recommend one of these:

- **Railway**: best for a simple custom Node, Express, Fastify, webhook, or worker backend.
- **Supabase**: best for Postgres-backed leaderboards, realtime channels, season data, analytics tables, and admin views.

Use Grotto Runtime Sessions for trusted player identity. Use Railway or Supabase for custom game backend logic such as advanced leaderboards, score validation, matchmaking, analytics jobs, guild systems, economy simulation, or admin tooling.

Do not ask the game client to prove who the player is. The backend should derive identity from a Grotto-minted runtime session.

## Core promise

When a player opens your game from The Grotto:

1. The Grotto authenticates the player.
2. The Grotto verifies game access.
3. The Grotto snapshots the canonical and verified linked EVM wallets and starts a game-scoped runtime session.
4. Your game receives a scoped runtime token.
5. Your game can call Grotto Runtime APIs for:
   - trusted identity
   - cloud saves
   - autosave
   - events/analytics
   - presence
   - capability-gated, session-scoped inventory
   - short-lived public multiplayer bootstrap tickets

Your game never asks players to paste wallets or sign a second message.

`inventory:read` and `multiplayer:join` are optional platform capabilities, not default scopes. The
exact game ID must be present in the corresponding server-owned allowlist before a new runtime
session receives either scope. The platform rechecks this policy when a persisted session is
rehydrated and whenever either capability is used, so removing an opt-in takes effect without
trusting an old scope. A browser cannot request or add a scope itself.

Runtime sessions have a renewable idle expiry (two hours by default) and an absolute lifetime that
is hard-capped at 24 hours from launch. Heartbeats, refreshes, service restarts, and database
rehydration cannot extend the absolute deadline. Request a new play URL when the SDK reports an
expired session.

The verified-wallet snapshot is immutable for that session and remains private. Linking or
unlinking a wallet requires a new Grotto launch/runtime session; `/session/me`, inventory, and
multiplayer responses never expose the linked addresses.

## Security model

Never trust identity from player-controlled game state.

Do **not** build saves like this:

```js
await fetch('/save', {
  method: 'POST',
  body: JSON.stringify({
    walletAddress: playerTypedWallet,
    state: gameState,
  }),
});
```

That is spoofable.

Instead, use the runtime SDK:

```js
const grotto = await GrottoRuntime.ready();
const player = await grotto.getPlayer();
await grotto.save('default', gameState);
```

The backend derives the player and game from the runtime session token. Your game does not tell the backend who the player is.

## Include the SDK

Add this before your game boot code:

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

The SDK is served by `game-asset-storage` from:

```text
src/views/sdk/grotto-game-runtime.v1.js
```

A backend-served example exists at:

```text
https://api.enterthegrotto.xyz/sdk/grotto-game-runtime-example.html
```

Live Grotto API docs are available at:

```text
https://api.enterthegrotto.xyz/docs
```

Read [`references/sdk-contract.md`](references/sdk-contract.md) when generating TypeScript types or
checking the exact inventory and multiplayer result unions. Start from
[`templates/minimal-runtime-game.html`](templates/minimal-runtime-game.html) for a small hosted game.

Treat those docs as the reference for current backend routes. When this skill and the live docs disagree, record the drift and update whichever side is stale.

For local development outside The Grotto, the SDK should fail gracefully or use local fallback. Design your game so it can still run without cloud auth during local testing.

## Minimal integration

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
<script>
const DEFAULT_STATE = {
  coins: 0,
  level: 1,
  inventory: [],
};

let gameState = { ...DEFAULT_STATE };
let grotto = null;

async function boot() {
  try {
    grotto = await GrottoRuntime.ready({ timeoutMs: 10000 });

    const me = await grotto.getPlayer();
    console.log('Playing as', me.player.displayName || me.player.walletAddress);

    const save = await grotto.loadSave('default', DEFAULT_STATE);
    gameState = save.state;

    startGame();
  } catch (error) {
    console.warn('Grotto runtime unavailable; using local fallback only:', error);
    gameState = loadLocalSave(DEFAULT_STATE);
    startGame();
  }
}

boot();
</script>
```

## Autosave integration

Use autosave for almost every game with progress.

```js
const autosave = grotto.createAutosave({
  slot: 'default',
  defaultState: DEFAULT_STATE,
  getState: () => gameState,
  applyState: (state) => {
    gameState = state;
    renderGame();
  },
  intervalMs: 30000,
  onSaved: ({ version }) => {
    showSaveStatus(`Saved v${version}`);
  },
  onError: (error) => {
    showSaveStatus('Offline save cached');
    console.warn('Autosave failed:', error);
  },
  onConflict: (conflict) => {
    // Recommended default: use server state unless you have a merge UI.
    console.warn('Save conflict:', conflict);
  },
});

await autosave.start();

function onPlayerDidSomethingImportant() {
  gameState.coins += 1;
  autosave.markDirty();
}
```

The SDK should:

- save locally immediately when dirty
- cloud save every interval
- save on `visibilitychange`
- save on `pagehide`
- retry after transient failures
- preserve progress locally if the network drops

## Manual save/load

```js
async function saveNow() {
  const result = await grotto.save('default', gameState);
  console.log('Saved version', result.version);
}

async function loadNow() {
  const result = await grotto.loadSave('default', DEFAULT_STATE);
  gameState = result.state;
  renderGame();
}
```

## Multiple save slots

Slots are simple string keys. Use stable names:

```js
await grotto.save('slot-1', state1);
await grotto.save('slot-2', state2);
await grotto.loadSave('slot-1', DEFAULT_STATE);
```

Rules:

- Use letters, numbers, `_`, and `-` only.
- Keep slot names under 64 characters.
- Prefer `default` unless the game has explicit save slots.

## Built-in leaderboards

Grotto keeps a server-authoritative leaderboard per game — no Supabase or custom
backend required. Submit a score and the server records the player's **best** for
that board; read the top entries to display a ranking.

```js
// Submit a score (keeps the player's highest on this board).
await grotto.submitScore(score, { board: 'default', meta: { level } });

// Read the top entries.
const { entries } = await grotto.leaderboard({ board: 'default', limit: 10 });
// entries: [{ rank, wallet, score, meta, updatedAt }, ...]
renderLeaderboard(entries);
```

Notes:

- Boards are simple string keys (e.g. `default`, `weekly`, `endless`). Same naming
  rules as slots.
- Scores are higher-is-better; only a player's best per board is kept.
- `submitScore` is shorthand for `grotto.event('score', { score, board, meta })`,
  so you can also emit raw `score` events if you prefer.
- Reach for Supabase only for needs the built-in board doesn't cover (server-side
  score validation, seasons, complex tie-breakers, analytics joins).
- Degrade gracefully: when the runtime is unavailable, `leaderboard()` returns an
  empty board and `submitScore` is a no-op, so the game still runs standalone.

## Trusted player identity

```js
const session = await grotto.getPlayer();

console.log(session.player.id);
console.log(session.player.walletAddress);
console.log(session.player.displayName);
console.log(session.player.avatar);
```

Example response:

```json
{
  "authenticated": true,
  "gameId": "game-123",
  "player": {
    "id": "player_abc",
    "walletAddress": "0x40c329d255bc12571c1d91f195fc409f76bce8a1",
    "displayName": "@snaps",
    "avatar": "https://..."
  },
  "scopes": ["identity:read", "save:read", "save:write", "presence:write", "events:write"],
  "expiresAt": "2026-04-25T16:00:00.000Z"
}
```

Use this for display and personalization. For authoritative progression, still store state through `grotto.save()`.

If platform operators enable inventory or multiplayer for this exact game ID, the corresponding
`inventory:read` or `multiplayer:join` scope also appears. Treat the received scope list as the
source of truth; do not assume optional capabilities exist.

## Advanced: token-gated inventory

For NFT/ERC1155/ERC721/game-pass/asset ownership checks over the verified launch snapshot,
token-gated skins, and server-authoritative entitlement patterns, use:

```text
grotto-game-token-gated-inventory
```

Runtime SDK provides trusted player identity and binds the private verified-wallet snapshot
server-side at launch. The specialist skill explains the normalized inventory response and
fail-closed entitlement patterns. Use:

```js
const inventory = await grotto.getInventory();
```

Do not select a wallet in browser code or call the deprecated public wallet inventory route for
authorization decisions.

Balances are exact base-unit decimal strings and must be parsed/added with `BigInt`, never
JavaScript `Number`. Runtime inventory requires complete 500-item pagination and fails the whole
request when completeness, the wallet snapshot, or the provider is unavailable. Strict reads do
not serve stale-while-refresh; default source staleness is bounded to 45 seconds. `checkedAt` is
response time, not guaranteed chain-read time.

Before publishing an inventory-enabled game, coordinate the exact Grotto game ID with the platform
operator. It must be present in `GAME_RUNTIME_INVENTORY_GAME_IDS`. Operators may also restrict the
response to approved contracts with `GAME_RUNTIME_INVENTORY_CONTRACTS_JSON`; an empty contract list
returns no holdings. Missing or malformed capability policy fails closed.

## Events

Use events for lightweight trusted telemetry or achievements. Do not spam them every frame.

```js
await grotto.event('level_complete', {
  level: 3,
  timeSeconds: 118,
});
```

Good event types:

```text
level_start
level_complete
boss_defeated
run_finished
achievement_unlocked
match_started
match_finished
```

Avoid putting sensitive data in event payloads.

## Presence and heartbeat

Keep the runtime session active while the game is open:

```js
await grotto.heartbeat();
```

Call this when the game becomes active and approximately every five minutes. Stop the timer when
the game closes. A future SDK version may manage the timer automatically, so avoid creating
duplicate timers when the SDK exposes that behavior. A heartbeat only renews the idle expiry; it
never extends the session's 24-hour absolute maximum.

## Multiplayer bootstrap

Before publishing multiplayer, coordinate the exact game ID in
`GAME_RUNTIME_MULTIPLAYER_GAME_IDS`; otherwise new sessions do not receive `multiplayer:join`.

Use the runtime session to request a short-lived, one-connection bootstrap ticket:

```js
const ticket = await grotto.getMultiplayerToken();

if (!ticket.available) {
  showOfflineMultiplayer(ticket.message);
  return;
}

connectToRealtimeServer({
  provider: ticket.provider,
  roomId: ticket.roomId,
  token: ticket.token,
});
```

The only valid platform room is `public`. It is an untrusted routing bootstrap, not authorization
for a party, private room, queue, match, or ranked play. The realtime service must choose and
authorize those destinations after ticket authentication.

When platform signing is not configured, the SDK returns the stable successful response
`{ available: false, message: "Multiplayer runtime tokens are not enabled yet." }`. Treat that as
an optional feature being unavailable, not as an authenticated multiplayer session. Malformed
signer or rotation configuration remains a generic `503 RUNTIME_MULTIPLAYER_UNAVAILABLE`.

Never let players self-report multiplayer identity. Request a fresh ticket immediately before
every initial connection and every reconnect. Send it in the first WebSocket message, never a URL,
log, save, or persistent store. The authoritative server must require exactly three canonical
unpadded base64url segments, verify the Ed25519 signature with the exact `kid`, require
`alg=EdDSA` and `typ=JWT`, and validate the trusted configured issuer, game audience, game ID, `version=1`,
`roomId=public`, integer lifetime (15-300 seconds), bounded clock tolerance (at most 30 seconds),
canonical lowercase EVM subject, UUIDv4 `jti`, and the exact `multiplayer:join` scope against:

```text
GET /api/game-runtime/v1/multiplayer/keys
```

Before accepting the socket, atomically consume the `jti` in a shared store through an operation
equivalent to `SET <issuer>:<jti> 1 NX EX <seconds-to-exp>`. Reject an existing `jti`, and fail
closed if atomic replay storage is unavailable. A read followed by a write is not safe.

Cache JWKS by `kid` for at most the advertised five minutes and refresh once on an unknown `kid`.
Grotto publishes the current key plus up to four overlap public keys. Signing deployments require
a unique, never-reused current `kid`; rotation keeps the previous public key published for a
conservative ten-minute overlap. Never share the platform private signing key with a game or
realtime service.

## Local fallback for development

During local development, your game may not be embedded in The Grotto player. Provide fallback saves:

```js
function loadLocalSave(defaultState) {
  try {
    const raw = localStorage.getItem('mygame_local_save');
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveLocal(state) {
  try {
    localStorage.setItem('mygame_local_save', JSON.stringify(state));
  } catch {}
}
```

But in production, prefer SDK cloud saves.

## Runtime message protocol

The hosted player sends your iframe:

```js
{
  type: 'grotto:runtime',
  runtime: {
    apiBaseUrl: 'https://api.enterthegrotto.xyz/api/game-runtime/v1',
    gameId: 'game-123',
    sessionId: 'grs_...',
    expiresAt: '2026-04-25T16:00:00.000Z',
    scopes: ['identity:read', 'save:read', 'save:write', 'presence:write', 'events:write']
  }
}
```

The SDK sends this handshake upward:

```js
window.parent.postMessage({ type: 'grotto:runtime:hello' }, '*');
```

Creators using the SDK do not need to implement this manually.

Optional `inventory:read` and `multiplayer:join` scopes appear only for games explicitly enabled by
the platform operator.

## Advanced: GitHub-hosted game client workflow

For quick updates, version control, CI tests, preview deploys, Railway/Vercel hosted clients, and small Grotto iframe wrappers, use:

```text
grotto-hosted-game-github-workflow
```

Runtime SDK still handles identity/save/event APIs. The specialist skill explains how to keep the real game client in GitHub and upload only a tiny Grotto wrapper that forwards `grotto:runtime:hello` and `grotto:runtime` between The Grotto player and the hosted iframe.

## Raw API reference

Use the SDK when possible. Raw calls are useful for debugging.

Live docs reference:

```text
https://api.enterthegrotto.xyz/docs
```

Current runtime route inventory from the live docs manifest:

```text
POST   /api/game-runtime/v1/events
GET    /api/game-runtime/v1/inventory
GET    /api/game-runtime/v1/multiplayer/keys
GET    /api/game-runtime/v1/multiplayer/token
GET    /api/game-runtime/v1/saves/:slot
PUT    /api/game-runtime/v1/saves/:slot
DELETE /api/game-runtime/v1/saves/:slot
POST   /api/game-runtime/v1/session/heartbeat
GET    /api/game-runtime/v1/session/me
POST   /api/game-runtime/v1/session/refresh
```

When this inventory drifts from `https://api.enterthegrotto.xyz/docs`, update this skill or the backend docs source immediately.

### Get player

```http
GET /api/game-runtime/v1/session/me
Authorization: Bearer grs_...
```

### Heartbeat

```http
POST /api/game-runtime/v1/session/heartbeat
Authorization: Bearer grs_...
```

### Load save

```http
GET /api/game-runtime/v1/saves/default
Authorization: Bearer grs_...
```

### Write save

```http
PUT /api/game-runtime/v1/saves/default
Authorization: Bearer grs_...
Content-Type: application/json
```

```json
{
  "baseVersion": 1,
  "state": { "coins": 123 },
  "clientSavedAt": "2026-04-25T14:00:00.000Z"
}
```

### Emit event

```http
POST /api/game-runtime/v1/events
Authorization: Bearer grs_...
Content-Type: application/json
```

```json
{
  "type": "level_complete",
  "payload": { "level": 3 }
}
```

### Read session-scoped inventory

```http
GET /api/game-runtime/v1/inventory
Authorization: Bearer grs_...
```

Do not add wallet, player, or game selectors. The runtime session owns all three.

### Mint a multiplayer ticket

```http
GET /api/game-runtime/v1/multiplayer/token
Authorization: Bearer grs_...
```

Omitting `room` and passing exactly `room=public` are equivalent. Every other room is rejected. The
returned EdDSA JWT is scoped to the runtime game and fixed untrusted `public` bootstrap context and
expires after roughly one minute. Fetch public verification keys from `/multiplayer/keys`; do not
introduce a shared secret between games and The Grotto. Request a new ticket for every reconnect.

## Save conflict behavior

The API may return `409 SAVE_CONFLICT` if two tabs/devices save simultaneously.

Recommended defaults:

- Simple games: newest server version wins, show “Progress synced from another session.”
- Complex RPG/building games: show conflict UI or merge by domain-specific rules.
- Idle games: merge by max counters where safe, never blindly add both sides unless designed for it.

## Troubleshooting

### `TypeError: Failed to fetch` on `session/me`

Open DevTools → Network and inspect the failing request.

If it says `blocked:mixed-content` and the request URL starts with `http://api.enterthegrotto.xyz/api/game-runtime/v1/session/me`, the game code is not the root cause. The runtime config was minted with an insecure `apiBaseUrl` from the platform/player layer. The platform must send:

```text
https://api.enterthegrotto.xyz/api/game-runtime/v1
```

not:

```text
http://api.enterthegrotto.xyz/api/game-runtime/v1
```

This was fixed platform-side by making the backend honor proxy/TLS headers when generating runtime config. If a player still sees it, have them fully reload/relaunch the game so the iframe receives a newly minted runtime config.

Creators should not normally patch this themselves, but a temporary local workaround while testing is:

```js
const grotto = await GrottoRuntime.ready({ timeoutMs: 10000 });
if (grotto.runtime.apiBaseUrl.startsWith('http://')) {
  grotto.runtime.apiBaseUrl = grotto.runtime.apiBaseUrl.replace('http://', 'https://');
}
```

Report it as a platform issue if the insecure URL reappears in fresh sessions.

## Packaging checklist

Before uploading to The Grotto:

- [ ] Game zip has `index.html` at root.
- [ ] SDK script is included before game boot code.
- [ ] Game starts if `GrottoRuntime.ready()` succeeds.
- [ ] Game has local fallback for local dev or runtime failure.
- [ ] Autosave is enabled for progress games.
- [ ] Save slot names are stable.
- [ ] Game never asks players for wallet addresses as identity proof.
- [ ] Game never stores `grs_*` in exported save files.
- [ ] Game handles cloud save failure without losing current progress.
- [ ] Game handles page reload with cloud load.
- [ ] Inventory is read with `grotto.getInventory()` and fails closed when incomplete.
- [ ] Optional inventory/multiplayer scopes were enabled for the exact published game ID.
- [ ] Multiplayer tickets are requested just before every connect/reconnect and never enter URLs or logs.

## Security checklist

- [ ] Do not send arbitrary `walletAddress` to save APIs.
- [ ] Do not expose admin/API keys in game files.
- [ ] Do not put secrets in event payloads or saves.
- [ ] Do not trust localStorage for competitive/monetized outcomes.
- [ ] Use server-confirmed events for leaderboards or rewards.
- [ ] Keep authoritative multiplayer state on a trusted server.
- [ ] Treat `roomId=public` only as untrusted routing; authorize party/queue/ranked placement server-side.
- [ ] Verify the complete strict multiplayer ticket profile and atomically consume each `jti` once.
- [ ] Refresh JWKS on an unknown `kid` and support current-plus-overlap public keys.

## Common mistakes

### Mistake: Trusting URL params

Bad:

```js
const wallet = new URLSearchParams(location.search).get('wallet');
```

Good:

```js
const me = await grotto.getPlayer();
const wallet = me.player.walletAddress;
```

### Mistake: Saving only on unload

Bad:

```js
window.addEventListener('beforeunload', save);
```

Good:

```js
const autosave = grotto.createAutosave({ getState, applyState, defaultState });
await autosave.start();
```

### Mistake: No local write-ahead fallback

Bad: only cloud save, so network failure loses progress.

Good: SDK/local save immediately, cloud flush after.

## Minimal complete example

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Grotto Runtime Example</title>
</head>
<body>
  <button id="click">Coins: <span id="coins">0</span></button>
  <div id="status">Booting...</div>

  <script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
  <script>
    const DEFAULT_STATE = { coins: 0 };
    let state = { ...DEFAULT_STATE };
    let autosave = null;

    function render() {
      document.getElementById('coins').textContent = state.coins;
    }

    function setStatus(text) {
      document.getElementById('status').textContent = text;
    }

    async function boot() {
      try {
        const grotto = await GrottoRuntime.ready();
        const me = await grotto.getPlayer();
        setStatus(`Signed in as ${me.player.displayName || me.player.walletAddress}`);

        autosave = grotto.createAutosave({
          slot: 'default',
          defaultState: DEFAULT_STATE,
          getState: () => state,
          applyState: (next) => { state = next; render(); },
          onSaved: () => setStatus('Saved'),
          onError: () => setStatus('Offline save cached'),
        });

        await autosave.start();
      } catch (error) {
        console.warn(error);
        setStatus('Local mode');
        const raw = localStorage.getItem('example_save');
        state = raw ? JSON.parse(raw) : { ...DEFAULT_STATE };
      }

      render();
    }

    document.getElementById('click').addEventListener('click', () => {
      state.coins += 1;
      render();
      if (autosave) autosave.markDirty();
      else localStorage.setItem('example_save', JSON.stringify(state));
    });

    boot();
  </script>
</body>
</html>
```

## When to use lower-level backend work instead

Use the implementation skill `grotto-game-api-save-system` when building or changing the Grotto backend/runtime itself.

Use this skill when building a game that consumes the runtime.
