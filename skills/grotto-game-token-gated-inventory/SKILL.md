---
name: grotto-game-token-gated-inventory
description: Token-gate Grotto game cosmetics, skins, levels, and rewards through Runtime SDK identity and session-scoped ERC-721/ERC-1155 inventory.
version: 1.1.0
author: Bob AI Mk. I
license: MIT
metadata:
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
3. The platform resolves the canonical player and all verified linked EVM wallets server-side.
4. Match normalized holdings against the game's configured contract/token gates.
5. Recheck on boot, account changes, and before valuable actions so transfers revoke access.
6. Make economically valuable grants on a trusted server.

The browser must not choose a wallet, player ID, or game ID for an inventory query. Do not use URL
parameters, typed wallet addresses, or the deprecated `/api/inventory/:wallet` route as an
authorization source.

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
      "balance": "2",
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
    "totalBalance": "2"
  },
  "partial": false,
  "checkedAt": "2026-07-14T18:00:00.000Z"
}
```

Balances are decimal strings. Parse them with `BigInt`, never floating point. Holdings for the
same contract and token are already aggregated across verified linked wallets. Wallet addresses
used during resolution are not returned.

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
3. The platform derives the canonical player and verified linked wallets from the runtime session.
4. The game backend evaluates the configured contract/token gate.
5. The grant record stores the canonical player, gate, reason, timestamp, and inventory check
   result—not the runtime token.
6. The client receives only the resulting entitlement or grant status.

Never place `grs_*` in a URL, request body, log, database row, analytics payload, save, or exported
artifact. Never ship indexer keys, service-role keys, mint keys, or administrator secrets.

## Caching and revocation

- Cache presentation-only checks for 30-120 seconds.
- Recheck on game boot, account change, reconnect, and before valuable grants.
- Treat `503`, invalid data, or `partial !== false` as no entitlement until a complete check works.
- Remove cosmetic access after ownership disappears.
- Keep valuable grant records idempotent and auditable.

## Security checklist

- [ ] Use `grotto.getInventory()` rather than a wallet-selected inventory URL.
- [ ] Require `inventory:read` on the runtime session.
- [ ] Treat balances as `BigInt` decimal strings.
- [ ] Fail closed for partial or unavailable inventory.
- [ ] Revoke presentation access after transfers.
- [ ] Make valuable grants server-side and idempotent.
- [ ] Never log, persist, or export the runtime token.
