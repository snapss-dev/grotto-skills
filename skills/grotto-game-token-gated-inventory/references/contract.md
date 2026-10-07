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
For ERC20 holdings, match `standard: 'ERC20'` and the contract address; `tokenId` is `null`.
Reading a token balance does not require token-to-game linking.
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

ERC20 holdings also include `decimals` (integer or `null` when unknown) and `symbol` (string or
`null`). Their `classification` is `token`; `resource` may contain the token name. For example,
one $HOPE is represented as:

```json
{
  "standard": "ERC20",
  "contractAddress": "0x3bcbfa30d64ec6f844c2575fedd625fe6d083fce",
  "tokenId": null,
  "balance": "1000000000000000000",
  "decimals": 18,
  "symbol": "HOPE",
  "classification": "token",
  "resource": { "id": null, "name": "Hope", "image": null }
}
```

The response covers ERC20 contracts tracked by the platform indexer, alongside ERC1155 and
ERC721 holdings. Native HERESY is not an ERC20 holding. Unknown decimals must not silently
default to 18. `summary.totalBalance` is the sum of heterogeneous raw units, not a meaningful
currency total; evaluate each contract separately. See [gates](gates.md) for an ERC20 threshold.
