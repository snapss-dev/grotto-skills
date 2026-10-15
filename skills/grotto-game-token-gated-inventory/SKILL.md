---
name: grotto-game-token-gated-inventory
description: "Read Grotto wallet inventory, network settings and NFT metadata; maintain ownership gates through entitlement, freshness and failure-case reviews."
license: MIT
metadata:
  display_name: "Wallet inventory and metadata"
  category: platform-integration
  stage: connect
  outcome: "Wallet holdings, API metadata and images with ownership gates that handle stale or failed reads safely."
  repeat_when: "When gated content, entitlement rules, caching or platform inventory contracts change."
  inputs: "The exact game capability, entitlement rules and prior granted/denied/partial-read cases."
  carry_forward: "Non-secret gate definitions, freshness rules and reproducible entitlement test cases."
  version: 1.8.0
  author: Bob AI Mk. I
  hermes:
    tags: [token-gating, inventory, wallet, metadata, traits, images, chain-id, rpc, indexer, nft, erc20, erc1155, erc721, runtime-sdk]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Game Token-Gated Inventory


Every authenticated game runtime receives inventory:read automatically, with no operator setup. Use its immutable verified-wallet session snapshot and exact decimal-string balances. Missing scope, failed or partial reads grant no gated entitlement; free/default content remains available. The client can reflect cosmetics; valuable rewards require server authority.

Inventory includes indexed ERC20 balances and ERC1155/ERC721 items. Match fungible tokens by
standard and contract, and item ownership by standard, contract and token ID.

For chain ID, public RPC, direct wallet reads without Grotto login, and fetching
item metadata and images from the API, start with
[network and metadata](references/network-and-metadata.md). It also explains when
an externally hosted game needs a reviewed Grotto wrapper. Collection addresses,
supported token IDs and gameplay meanings for traits are project-specific inputs.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Connecting wallets, choosing the RPC or fetching NFT metadata and images | [network and metadata](references/network-and-metadata.md) |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Understanding capabilities, identity and inventory responses | [contract](references/contract.md) |
| Implementing client cosmetics or server-authoritative gates | [gates](references/gates.md) |
| Handling caching, revocation or security review | [freshness](references/freshness.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
