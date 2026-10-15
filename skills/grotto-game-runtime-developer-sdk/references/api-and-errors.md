# Runtime HTTP APIs and error recovery

Prefer the SDK. The fixed production base for raw requests is
https://api.enterthegrotto.xyz/api/game-runtime/v1. Live API docs are at
https://api.enterthegrotto.xyz/docs; their machine-readable manifest is at
https://api.enterthegrotto.xyz/api/docs/manifest.

Protected requests use Authorization: Bearer <runtime.sessionId>. JSON writes
also use Content-Type: application/json. The opaque grs_ credential comes from
the trusted runtime handshake and is separate from a platform account bearer.
Session responses can contain credentials: never log complete requests or responses.

## Routes and authority

| Method and path relative to the runtime base | Required scope or authority | Request or behavior |
| --- | --- | --- |
| GET /health | Public | Shared service health, not a particular game's admission or scopes. |
| GET /session/me | identity:read | Verified player, game, purpose, scopes and expiry. |
| POST /session/heartbeat | Valid runtime session | Renew presence; use the returned expiry. |
| POST /session/refresh | Valid runtime session | Refresh within the absolute lifetime. |
| POST /session/end | Valid runtime session | End the presented session. |
| GET /saves/:slot | save:read | Load the session player's slot. |
| PUT /saves/:slot | save:write | JSON {baseVersion, state, clientSavedAt?}. |
| DELETE /saves/:slot | save:write | Delete; returns {success, deleted}. |
| POST /events | events:write | JSON {type, payload?}; returns an eventId. |
| GET /leaderboard/:board | identity:read | Optional limit: default 50, maximum 500. Omit :board for default. |
| GET /inventory | inventory:read | Session inventory; no wallet, player or game selectors. |
| GET /multiplayer/keys | Public | Public Ed25519 keys for external-server tickets. |
| GET /multiplayer/token | multiplayer:join | Omit room or use exactly room=public. |
| POST /multiplayer/room | rooms:join | Join managed room; JSON {}. |
| GET /multiplayer/room | rooms:join | Poll with optional after cursor and version. |
| PATCH /multiplayer/room/presence | rooms:join | JSON {presence, after?, version?}. |
| PUT /multiplayer/room | rooms:join | JSON {changes, baseVersion, after?, version?}. |
| DELETE /multiplayer/room | rooms:join | Leave managed room. |

Hosted preview provides identity, saves and session maintenance. It does not grant
published inventory, events, scores, rooms or payment authority. The managed-room
router enforces rooms:join even if generated docs label its leaf handlers public.

Creator uploads, native admission and host actions use different authentication.
Use their setup guide or SDK typed actions; do not substitute a runtime token into
a platform account route. For your server, use [private-backend.md](private-backend.md).

## Saves, events and limits

Create a new slot with baseVersion 0. Retain the returned server version for each
subsequent write. State must be a JSON object or array.

~~~http
PUT /api/game-runtime/v1/saves/default
Authorization: Bearer <runtime.sessionId>
Content-Type: application/json
~~~

~~~json
{"baseVersion": 0, "state": {"coins": 123}}
~~~

A 409 SAVE_CONFLICT includes server version and state. Choose the server state or
merge by the game's rules, then explicitly retry with that version. An autosave
onConflict callback does not apply its return value or advance the SDK's version.
Do not blindly add counters from both saves.

~~~http
POST /api/game-runtime/v1/events
Authorization: Bearer <runtime.sessionId>
Content-Type: application/json
~~~

~~~json
{"type": "level_complete", "payload": {"level": 3}}
~~~

Save state is limited to 512 KiB of UTF-8 JSON. Slot and board identifiers use
1–64 letters, digits, underscores or hyphens. The default slot allowance is 16
per game/player. Event types use 1–80 letters, digits, underscores, dots, colons
or hyphens; event payloads are limited to 16 KiB. Scores must be finite numbers.
Submit scores through POST /events with type "score" and payload {score, board,
meta?}; grotto.submitScore() is shorthand for that event. A client submission is
not a verified achievement. See [saves-and-scores.md](saves-and-scores.md) for offline behavior.

## Multiplayer

Managed rooms need no external server or operator setup. Use grotto.joinRoom()
for polling, presence and optimistic patches. Snapshots have contractId, playerId,
seed, version, status, state and players. Room player IDs are opaque, not wallet
addresses. Raw poll cursors are strings; pass them back unchanged.
See [SDK types](sdk-contract.md) and [room limits](capabilities.md#grotto-hosted-multiplayer).

External-server tickets are a separate operator-enabled feature. The JWT uses
EdDSA and a fixed public bootstrap context, with a default lifetime of about one
minute. Get a new ticket on each reconnect. Verification keys:
https://api.enterthegrotto.xyz/api/game-runtime/v1/multiplayer/keys.
Default issuer: https://api.enterthegrotto.xyz.
Audience: grotto:game:<gameId>:multiplayer.
Verify expiry, game, player, scope and context, and atomically reject reused jti
values. Key verification alone does not authorize rooms or actions.
See [external-server requirements](../../grotto-hosted-game-github-workflow/references/capabilities.md).

## Errors and recovery

HTTP SDK failures expose error.status and error.body; inspect body.code.
Account changes can throw error.code === "SESSION_CHANGED". Never log credentials.

| Failure | Recovery |
| --- | --- |
| ready() timeout | Keep local play available. Verify Grotto launch and trusted frame handoff; do not invent an authenticated client. |
| 401 or SESSION_CHANGED | Stop the old player's work and reacquire the trusted session. Ignore old responses. |
| 403 | Check purpose, scopes and prerequisites; retrying cannot grant a missing capability. |
| 404 save | Treat as no cloud save; inspect the local fallback before initializing progress. |
| 409 SAVE_CONFLICT | Reconcile and explicitly retry with the server version. |
| 400 or 413 | Fix request shape, identifiers or size. |
| 429 | Respect Retry-After or body.retryAfterSeconds and back off. |
| 503 or network failure | Preserve local state and retry with backoff. A failed score remains failed. |

Default save-write ceilings are 60/minute and 1,200/hour per player, 600/minute
per game and 120/minute per IP. Event defaults are 120/minute and 3,000/hour per
player, 1,200/minute per game and 240/minute per IP. Deployments can tune limits;
the response is authoritative.

If an HTTPS game receives an HTTP apiBaseUrl or reports mixed content, relaunch
to obtain a fresh descriptor. Report the non-secret URL and launch context if it
persists. The platform must supply HTTPS; do not mutate the descriptor or relax
origin checks as a workaround.
