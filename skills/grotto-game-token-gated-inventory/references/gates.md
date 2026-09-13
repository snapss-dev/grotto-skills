# Implementing client cosmetics or server-authoritative gates

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
