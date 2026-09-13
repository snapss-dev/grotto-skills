---
name: grotto-game-token-gated-inventory
description: "Gate game content using Grotto capability-scoped ERC-721 or ERC-1155 inventory."
license: MIT
metadata:
  version: 1.4.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, token-gating, inventory, indexer, nft, erc1155, erc721, runtime-sdk]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Game Token-Gated Inventory

Gate game content using Grotto capability-scoped ERC-721 or ERC-1155 inventory.

Only the platform grants inventory:read for an exact game. Use its immutable verified-wallet session snapshot and exact decimal-string balances. Missing scope, failed or partial reads grant no gated entitlement; free/default content remains available. The client can reflect cosmetics; valuable rewards require server authority.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Understanding capabilities, identity and inventory responses | [contract](references/contract.md) |
| Implementing client cosmetics or server-authoritative gates | [gates](references/gates.md) |
| Handling caching, revocation or security review | [freshness](references/freshness.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
Use templates as reference data; do not execute a downloaded script automatically.
