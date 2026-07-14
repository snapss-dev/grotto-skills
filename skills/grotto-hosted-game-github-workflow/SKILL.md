---
name: grotto-hosted-game-github-workflow
description: Maintain Grotto games with GitHub, CI, hosted Railway/Vercel clients, a small secure runtime-forwarding wrapper, and authoritative inventory/multiplayer services that honor Grotto capability and ticket contracts.
license: MIT
metadata:
  version: 1.1.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, github, version-control, testing, ci, railway, vercel, iframe, wrapper]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Hosted Game GitHub Workflow

Use when a Grotto game should update like a normal web app: GitHub PRs, CI tests, auto-deploys, previews, and rollback.

## Pattern

1. Real game client lives in GitHub.
2. Client deploys to Railway/Vercel/Netlify/Cloudflare Pages over HTTPS.
3. Host auto-deploys from `main` or release tags.
4. Grotto upload is only a tiny `index.html` wrapper.
5. Wrapper iframes the hosted client and forwards Grotto runtime messages.

Benefits: fast updates, PR review, test gates, preview deploys, rollback, and fewer full zip uploads to Grotto.

## Repo layout

```text
my-grotto-game/
  package.json
  src/
  public/
  tests/
  wrapper/index.html
```

## Hosted client requirements

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

```js
const grotto = await GrottoRuntime.ready({ timeoutMs: 10000 });
const player = await grotto.getPlayer();
const save = await grotto.loadSave('default', DEFAULT_STATE);
startGame({ player, state: save.state });
```

The hosted URL must be HTTPS.

Optional inventory and multiplayer APIs are not enabled by the wrapper or client. The exact
published Grotto game ID must be allowlisted by the platform operator before a newly launched
runtime session receives `inventory:read` or `multiplayer:join`.

## Grotto wrapper

Upload this as the root `index.html` in the Grotto game zip.

```html
<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>My Grotto Game</title>
<style>html,body,#game{width:100%;height:100%;margin:0;border:0;overflow:hidden;background:#050510}</style>
</head><body>
<iframe id="game" title="My Grotto Game" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups" allow="fullscreen; autoplay; clipboard-read; clipboard-write; gamepad"></iframe>
<script>
const REMOTE_GAME_URL = 'https://my-game.up.railway.app';
const REMOTE_GAME_ORIGIN = new URL(REMOTE_GAME_URL).origin;
const iframe = document.getElementById('game');
const params = new URLSearchParams(location.search);
params.set('embedded', 'grotto');
iframe.src = `${REMOTE_GAME_URL}/?${params}`;
addEventListener('message', (event) => {
  const msg = event.data;
  if (!msg || typeof msg !== 'object') return;
  if (msg.type === 'grotto:runtime:hello' && event.source === iframe.contentWindow) {
    parent.postMessage({ type: 'grotto:runtime:hello' }, '*');
  }
  if (msg.type === 'grotto:runtime' && event.source === parent) {
    iframe.contentWindow?.postMessage(msg, REMOTE_GAME_ORIGIN);
  }
});
</script></body></html>
```

Only forward `grotto:runtime` from the wrapper's parent and only accept
`grotto:runtime:hello` from the hosted iframe. Never copy the `grs_*` session into the hosted URL,
query string, logs, analytics, localStorage, or build artifacts.

## Runtime capability rollout

Coordinate these server-owned settings with the Grotto platform operator after the final game ID
is known:

```dotenv
GAME_RUNTIME_INVENTORY_GAME_IDS=game-123
GAME_RUNTIME_MULTIPLAYER_GAME_IDS=game-123
GAME_RUNTIME_INVENTORY_CONTRACTS_JSON={"game-123":["0x1234567890abcdef1234567890abcdef12345678"]}
```

The capability lists are exact, comma-separated game IDs. Inventory contract policy is optional;
when a game has a mapping, only those contracts are returned, and an empty array returns none.
Malformed policy fails closed. Policy is rechecked when a persisted session is rehydrated and on
every capability use, so removing an opt-in takes effect without trusting an old scope. A client
cannot mint either optional scope or select a contract.

At launch, Grotto privately snapshots the canonical wallet plus all verified linked EVM wallets.
That authority is immutable for the session and never appears in runtime responses. Linking or
unlinking a wallet requires a new play URL/session. The default idle expiry is two hours; heartbeat
may renew it, but no heartbeat, refresh, restart, or rehydration can exceed the hard 24-hour
absolute lifetime.

Runtime inventory returns exact decimal-string balances aggregated with `BigInt` across the launch
snapshot. Require complete 500-item pagination and `partial === false`; do not round balances
through `Number`. Strict reads fail closed on missing/invalid snapshots, provider errors, unproven
pagination, page/wallet ceilings, or unavailable capability. They do not serve stale-while-refresh.
The default source-staleness bound is 45 seconds (15-second indexer freshness plus 30-second
classified cache), and `checkedAt` is response time rather than chain-read time.

## Authoritative multiplayer service

Request a ticket immediately before every initial connection and reconnect:

```js
const ticket = await grotto.getMultiplayerToken();
if (!ticket.available) {
  showOfflineMultiplayer(ticket.message);
} else {
  connect({ token: ticket.token });
}
```

If platform signing is absent, the stable response is HTTP 200 with
`{ "available": false, "message": "Multiplayer runtime tokens are not enabled yet." }`.

The platform always mints `roomId=public`. Treat it only as an untrusted routing bootstrap. The
Railway/Supabase realtime service must authorize party membership, queue, private room, match,
ranked eligibility, bans, and capacity after authentication. Never accept those selectors from the
ticket request.

Send the ticket in the first WebSocket message, never the URL. Before binding the socket, verify:

1. exactly three canonical unpadded base64url segments;
2. Ed25519 signature with exact `kid`, `alg=EdDSA`, and `typ=JWT`;
3. the trusted configured issuer, exact `grotto:game:<game-id>:multiplayer` audience, and game ID;
4. integer `iat`/`nbf`/`exp`, a 15-300 second lifetime, current activity, and at most 30 seconds of
   verifier clock tolerance;
5. `version=1`, `roomId=public`, canonical lowercase EVM `sub`, UUIDv4 `jti`, and the exact
   `multiplayer:join` scope; and
6. an atomic one-time `jti` claim in shared storage, equivalent to
   `SET <issuer>:<jti> 1 NX EX <seconds-to-exp>`.

Reject reused tickets. A read followed by a write is raceable; fail closed if the atomic replay
store is unavailable. Only then perform game-specific routing authorization.

Fetch public keys from `/api/game-runtime/v1/multiplayer/keys`, cache by `kid` for at most the
advertised five minutes, and refresh once when a `kid` is unknown. Grotto exposes the current key
plus up to four overlap public keys. Issuance operators must use an explicit, unique, never-reused
current `kid`, deploy the previous public key during rotation, and retain it for a conservative
ten-minute overlap. Hosted games and realtime services receive public keys only; never request or
share Grotto's private signing key.

Platform issuance uses `GAME_RUNTIME_MULTIPLAYER_PRIVATE_KEY` plus a required explicit
`GAME_RUNTIME_MULTIPLAYER_KEY_ID`; there is no default key ID. During rotation,
`GAME_RUNTIME_MULTIPLAYER_PREVIOUS_PUBLIC_KEYS_JSON` maps up to four distinct old IDs to Ed25519
SPKI **public** PEM keys. The current ID cannot also appear in the overlap map, and private PEM is
rejected there. Missing signing is the graceful `available: false` case above; malformed signer or
rotation configuration is a generic `503 RUNTIME_MULTIPLAYER_UNAVAILABLE`.

## Maintenance loop

1. Branch in GitHub.
2. Change game client.
3. Run tests/build locally.
4. Open PR.
5. CI runs unit/lint/build/Playwright checks.
6. Merge to `main`.
7. Railway/Vercel auto-deploys.
8. Existing Grotto wrapper loads new client.
9. Verify optional capability scopes and custom-service health with a newly launched session.
10. Roll back by reverting Git or rolling back deploy.

## Minimal CI

```yaml
name: game-client-ci
on: [pull_request]
jobs:
  test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build
```

## Wrapper regression test

```js
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const wrapper = readFileSync('wrapper/index.html', 'utf8');
describe('Grotto wrapper', () => {
  it('embeds hosted client and forwards runtime', () => {
    expect(wrapper).toContain('https://my-game.up.railway.app');
    expect(wrapper).toContain('grotto:runtime:hello');
    expect(wrapper).toContain('grotto:runtime');
    expect(wrapper).toContain('postMessage');
    expect(wrapper).toContain('event.source === parent');
    expect(wrapper).toContain('event.source === iframe.contentWindow');
  });
});
```

## Do not use when

- game must be a permanent self-contained archive
- hosted domain is not durable
- third-party scripts are unstable
- wrapper cannot forward runtime messages due sandbox/CSP
- project cannot provide shared atomic replay storage for authoritative multiplayer
