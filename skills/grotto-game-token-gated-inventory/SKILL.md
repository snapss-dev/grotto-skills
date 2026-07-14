---
name: grotto-game-token-gated-inventory
description: Token-gate Grotto game cosmetics, skins, levels, and rewards through capability-gated Runtime SDK identity, immutable verified-wallet snapshots, and exact ERC-721/ERC-1155 inventory.
license: MIT
metadata:
  version: 1.2.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, token-gating, inventory, indexer, nft, erc1155, erc721, runtime-sdk]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Game Token-Gated Inventory

Use when a Grotto-hosted game unlocks a cosmetic, skin, level, quest, game pass, or reward based on
ERC-721 or ERC-1155 ownership.

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

`inventory:read` is not a default runtime scope. Before publishing, coordinate the exact Grotto
game ID with the platform operator:

```dotenv
GAME_RUNTIME_INVENTORY_GAME_IDS=game-123
GAME_RUNTIME_INVENTORY_CONTRACTS_JSON={"game-123":["0x1234567890abcdef1234567890abcdef12345678"]}
```

The first variable is a comma-separated allowlist. The second is optional and maps a game ID to the
only contracts its runtime inventory may return. Omitting a mapping permits all indexed contracts
for an allowlisted game; an empty array permits none. A browser cannot select or expand this policy.
Missing or malformed policy fails closed, and a new session without the opt-in does not receive
`inventory:read`. The platform rechecks the policy when a persisted session is rehydrated and when
inventory is used, so removing an opt-in takes effect without trusting an old scope.

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
resolution are not returned. Per-game contract filtering may intentionally omit unrelated indexed
holdings.

## Client-side cosmetic gate

Client-side checks are suitable for presentation-only cosmetics. This example unlocks
`obsidian-knight` for token `7`:

```js
const GATE = {
  cosmeticId: 'obsidian-knight',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
  tokenId: '7',
  minimumBalance: 1n,
};

function normalizeAddress(value) {
  const address = String(value || '').toLowerCase();
  return /^0x[a-f0-9]{40}$/.test(address) ? address : null;
}

function ownsGate(inventory, gate) {
  if (!inventory || inventory.partial !== false || !Array.isArray(inventory.holdings)) {
    return false;
  }
  const contract = normalizeAddress(gate.contractAddress);
  if (!contract) return false;

  const total = inventory.holdings.reduce((sum, holding) => {
    if (normalizeAddress(holding.contractAddress) !== contract) return sum;
    if (String(holding.tokenId) !== String(gate.tokenId)) return sum;
    if (!/^(0|[1-9][0-9]*)$/.test(String(holding.balance))) return sum;
    return sum + BigInt(holding.balance);
  }, 0n);
  return total >= gate.minimumBalance;
}

async function refreshCosmetic(grotto, gameState) {
  let inventory;
  try {
    inventory = await grotto.getInventory();
  } catch {
    inventory = null;
  }
  const entitled = ownsGate(inventory, GATE);
  const unlocked = new Set(gameState.tokenGatedCosmetics || []);
  if (entitled) unlocked.add(GATE.cosmeticId);
  else unlocked.delete(GATE.cosmeticId);
  gameState.tokenGatedCosmetics = [...unlocked];
  return entitled;
}
```

Do not permanently copy token ownership into an ordinary cloud save. The current inventory check
owns the entitlement; a transfer should remove the cosmetic on the next refresh.

## Server-authoritative gates

Use server-side checks for prizes, ranked advantages, paid rewards, mints, tradeable grants, or
anything economically meaningful.

Recommended flow:

1. The browser sends its `grs_*` runtime token to the game backend only in an HTTPS
   `Authorization: Bearer` header.
2. The game backend calls the runtime inventory endpoint with that credential or uses an approved
   server integration.
3. The platform uses the immutable verified-wallet snapshot bound to the runtime session.
4. The game backend evaluates the configured contract/token gate.
5. The grant record stores the canonical player, gate, reason, timestamp, and inventory check
   result—not the runtime token.
6. The client receives only the resulting entitlement or grant status.

Never place `grs_*` in a URL, request body, log, database row, analytics payload, save, or exported
artifact. Never ship indexer keys, service-role keys, mint keys, or administrator secrets.

## Caching and revocation

- Runtime inventory reads require complete 500-item pagination with non-negative safe-integer
  ERC-1155 and ERC-721 totals. Missing totals, provider errors, exceeding
  `GAME_RUNTIME_INVENTORY_MAX_PAGES` (default 20, clamped to 1-100) for a wallet, an invalid/missing
  wallet snapshot, or more than 50 snapshotted wallets fail the whole request with generic
  `503 RUNTIME_INVENTORY_UNAVAILABLE`.
- Strict runtime reads do not serve stale-while-refresh. With default settings, source staleness is
  bounded by the 15-second fresh indexer cache plus the 30-second classified cache: 45 seconds.
- `checkedAt` is response construction time, not proof of a chain read at that instant.
- Avoid adding another cache for valuable grants. If presentation-only code adds a cache, include
  that extra duration in the revocation window.
- Recheck on game boot, reconnect, and before valuable grants. Relaunch after linked-account changes.
- Treat `403` missing scope, `503`, invalid data, or `partial !== false` as no entitlement until a
  newly authorized complete check works. Keep free/default cosmetics playable; never unlock the
  gated benefit on failure.
- Remove cosmetic access after ownership disappears.
- Keep valuable grant records idempotent and auditable.

## Security checklist

- [ ] Use `grotto.getInventory()` rather than a wallet-selected inventory URL.
- [ ] Require `inventory:read` on the runtime session.
- [ ] Confirm the exact game ID is in `GAME_RUNTIME_INVENTORY_GAME_IDS`.
- [ ] Configure `GAME_RUNTIME_INVENTORY_CONTRACTS_JSON` when the game should see only approved contracts.
- [ ] Treat the launch-time wallet snapshot as immutable and require relaunch after account changes.
- [ ] Treat balances as `BigInt` decimal strings.
- [ ] Require complete pagination and fail closed for partial, unproven, or unavailable inventory.
- [ ] Account for the platform's bounded 45-second default source-staleness window.
- [ ] Revoke presentation access after transfers.
- [ ] Make valuable grants server-side and idempotent.
- [ ] Never log, persist, or export the runtime token.
