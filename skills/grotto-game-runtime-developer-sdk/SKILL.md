---
name: grotto-game-runtime-developer-sdk
description: "Integrate Grotto identity, saves, shared rooms and reviewed actions."
license: MIT
metadata:
  display_name: "Runtime SDK"
  category: platform-integration
  stage: connect
  outcome: "Identity, saves, shared rooms and reviewed actions."
  repeat_when: "Service contracts, save schemas or capabilities change."
  inputs: "Runtime, services and prior scenarios."
  carry_forward: "Service, save-version and recovery decisions."
  version: 1.16.0
  author: Bob AI Mk. I
  hermes:
    tags: [progress, autosave, save, saves, score, leaderboard, runtime-sdk, cloud-saves, leaderboards, auth, multiplayer, transactions, mint, marketplace, crowdfund, tips, transfers]
    related_skills: [grotto-game-token-gated-inventory, grotto-hosted-game-github-workflow, grotto-studio-game-updates]
---

# Runtime SDK

Choose browser or Unreal Windows with [Game Setup](../grotto-game-setup/SKILL.md).

Start play before network readiness. Trust host sessions; keep wallet snapshots
private. Preserve progress with version-aware saves. Enforce scopes and expiry.
`client.joinRoom()` hosts shared state/presence. Separate external-server tickets
grant no game authority. For registered-user tips, read [actions](references/actions.md);
supply username and exact HERESY amount. The host resolves and reviews the recipient.
For run records, NFT consumption or registered game operations, read the same
action reference and negotiate the exact advertised type. Keep progress and
reward verification separate from transaction or authorization confirmation.

The host binds runtime identity. For developer configuration before launch, use
the saved canonical game ID from create/update `game.id` or the owner's Creator
Hub and editor. Read [draft IDs and startup](references/identity-and-boot.md)
for authorized lookup and pre-build hosted previews. After browser launch, use
`client.runtime.gameId` from `await window.GrottoRuntime.ready()`. Keep
`sessionId` private; a copied game ID does not authenticate a player.

Read selectively:

| When | Read |
| --- | --- |
| Planning | [repeatable workflow](references/workflow.md) |
| Engine, input, assets | [studio-capabilities](references/studio-capabilities.md) |
| Controls and lifecycle | [foundations](references/control-foundations.md) |
| Startup and trusted identity | [identity-and-boot](references/identity-and-boot.md) |
| Saves, conflicts or leaderboards | [saves-and-scores](references/saves-and-scores.md) |
| Inventory, events, multiplayer | [capabilities](references/capabilities.md) |
| Player transactions | [reviewed actions](references/actions.md) |
| Standalone or hosted games | [hosting](references/hosting.md) |
| Raw API and runtime errors | [api-and-errors](references/api-and-errors.md) |
| Packaging | [packaging](references/packaging.md) |

In Studio, read_skill {name, resource}; follow nextOffset.
Reads do not authorize builds or publication.
