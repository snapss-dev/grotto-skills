---
name: grotto-game-token-gated-inventory
description: "Maintain optional ownership gates through repeated entitlement, freshness and failure-case reviews when game content or inventory requirements change."
license: MIT
metadata:
  display_name: "Token-gated inventory"
  category: platform-integration
  stage: connect
  outcome: "Ownership gates that handle missing capabilities and stale inventory safely."
  repeat_when: "When gated content, entitlement rules, caching or platform inventory contracts change."
  inputs: "The exact game capability, entitlement rules and prior granted/denied/partial-read cases."
  carry_forward: "Non-secret gate definitions, freshness rules and reproducible entitlement test cases."
  version: 1.6.0
  author: Bob AI Mk. I
  hermes:
    tags: [token-gating, inventory, indexer, nft, erc1155, erc721, runtime-sdk]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Game Token-Gated Inventory


Every authenticated game runtime receives inventory:read automatically, with no operator setup. Use its immutable verified-wallet session snapshot and exact decimal-string balances. Missing scope, failed or partial reads grant no gated entitlement; free/default content remains available. The client can reflect cosmetics; valuable rewards require server authority.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Understanding capabilities, identity and inventory responses | [contract](references/contract.md) |
| Implementing client cosmetics or server-authoritative gates | [gates](references/gates.md) |
| Handling caching, revocation or security review | [freshness](references/freshness.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
