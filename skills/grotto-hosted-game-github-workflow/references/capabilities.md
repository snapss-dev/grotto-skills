# Enabling inventory or authorizing multiplayer

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
