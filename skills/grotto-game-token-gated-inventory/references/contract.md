# Understanding capabilities, identity and inventory responses

## Trust model

1. Start an authenticated Grotto Runtime session.
2. Call `grotto.getInventory()`.
3. The platform uses the immutable canonical-plus-verified-linked EVM wallet snapshot captured at launch.
4. Match normalized holdings against the game's configured contract/token gates.
5. Recheck on boot, reconnect, and before valuable actions so transfers revoke access.
6. Make economically valuable grants on a trusted server.

The browser must not choose a wallet, player ID, or game ID for an inventory query. Do not use URL
parameters, typed wallet addresses, or the deprecated `/api/inventory/:wallet` route as an
authorization source.

The wallet snapshot is private and fixed for the runtime session. Inventory responses never expose
linked wallet addresses. Linking or unlinking a wallet takes effect only after the player obtains a
new play URL/runtime session; an inventory refresh cannot mutate the current session's authority.
Session heartbeats may renew the default two-hour idle expiry but cannot extend the hard 24-hour
absolute lifetime.

## Platform capability policy

`inventory:read` is a default scope for every authenticated game runtime. No operator approval,
game allowlist, or contract allowlist is needed. Persisted sessions issued with older scope lists
also receive inventory access on rehydration.

The platform returns holdings across all indexed contracts in the verified launch snapshot.
Match the returned contract addresses and token IDs against your game's entitlement definitions.
The former inventory enablement and contract-filter settings are ignored, including empty or
malformed values. Runtime authentication, verified-wallet snapshots and complete inventory reads
remain required.

## Runtime API

Prefer the SDK:

```js
const grotto = await GrottoRuntime.ready({ timeoutMs: 10000 });
const inventory = await grotto.getInventory();
```

Raw debugging request:

```http
GET /api/game-runtime/v1/inventory
Authorization: Bearer grs_...
```

Do not add wallet, player, or game query parameters. The runtime session supplies them.

Example response:

```json
{
  "gameId": "game-123",
  "playerId": "0x40c329d255bc12571c1d91f195fc409f76bce8a1",
  "holdings": [
    {
      "standard": "ERC1155",
      "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
      "tokenId": "7",
      "balance": "9007199254740993123456789",
      "classification": "asset",
      "resource": {
        "id": "obsidian-knight",
        "name": "Obsidian Knight",
        "image": "https://..."
      }
    }
  ],
  "summary": {
    "walletsChecked": 2,
    "holdings": 1,
    "totalBalance": "9007199254740993123456789"
  },
  "partial": false,
  "checkedAt": "2026-07-14T18:00:00.000Z"
}
```

Balances are canonical, exact, additive base-unit decimal strings. Parse and add them with
`BigInt`, never `Number`, `parseInt`, or floating point. Holdings for the same contract and token
are already aggregated across the verified launch snapshot. Wallet addresses used during
resolution are not returned. The game selects relevant holdings using its own contract/token
definitions.
