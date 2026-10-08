# Using inventory, events, presence or multiplayer tickets

## Trusted player identity

```js
const session = await grotto.getPlayer();

console.log(session.player.id);
console.log(session.player.walletAddress);
console.log(session.player.displayName);
console.log(session.player.avatar);
```

Example response from an ordinary published game runtime:

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
  "scopes": ["identity:read", "inventory:read", "save:read", "save:write", "presence:write", "events:write"],
  "expiresAt": "2026-04-25T16:00:00.000Z"
}
```

Use this for display and personalization. For authoritative progression, still store state through `grotto.save()`.

Every ordinary published game runtime includes `inventory:read` automatically. Creator-only
hosted previews have identity and save scopes only. `multiplayer:join` appears only when platform
operators enable multiplayer for the exact game ID. Treat the received scope list as the source
of truth for optional capabilities.

## Advanced: token-gated inventory

For ERC20 balances and NFT/ERC1155/ERC721/game-pass/asset ownership checks over the verified launch snapshot,
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

ERC20 holdings use `standard: 'ERC20'`, `tokenId: null`, an exact base-unit `balance`,
and `decimals`/`symbol` metadata. Match by standard and contract address. Missing decimals
are `null`; use known token decimals for a threshold instead of assuming 18. The inventory
skill includes a $HOPE example. Token-to-game linking is not required to read a holding.

Do not select a wallet in browser code or call the deprecated public wallet inventory route for
authorization decisions.

Balances are exact base-unit decimal strings and must be parsed/added with `BigInt`, never
JavaScript `Number`. Runtime inventory requires complete 500-item pagination and fails the whole
request when completeness, the wallet snapshot, or the provider is unavailable. Strict reads do
not serve stale-while-refresh; default source staleness is bounded to 45 seconds. `checkedAt` is
response time, not guaranteed chain-read time.

Inventory requires no operator setup or game/contract allowlist. Call `grotto.getInventory()`
from the authenticated runtime and match returned holdings against your game's contract/token
definitions. The former inventory enablement and contract-filter settings are ignored.

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
