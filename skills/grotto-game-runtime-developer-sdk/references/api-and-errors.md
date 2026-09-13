# Looking up raw API behavior or diagnosing runtime errors

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
