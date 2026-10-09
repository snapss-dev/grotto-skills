---
name: grotto-game-runtime-developer-sdk
description: "Integrate Grotto host-provided game identity, saves, scores, scoped services and player-reviewed actions without asking Studio creators to paste a game ID."
license: MIT
metadata:
  display_name: "Runtime SDK"
  category: platform-integration
  stage: connect
  outcome: "Trusted identity, version-aware cloud saves and player-reviewed Grotto actions."
  repeat_when: "When a service contract, SDK usage, save schema or capability requirement changes."
  inputs: "The installed runtime, required services and prior identity/save scenarios."
  carry_forward: "Service requirements, save-version decisions and contract/recovery cases."
  version: 1.15.0
  author: Bob AI Mk. I
  hermes:
    tags: [progress, autosave, save, saves, score, leaderboard, runtime-sdk, cloud-saves, leaderboards, auth, multiplayer, transactions, mint, marketplace, crowdfund, tips, transfers]
    related_skills: [grotto-game-token-gated-inventory, grotto-hosted-game-github-workflow, grotto-studio-game-updates]
---

# Runtime SDK

Choose browser or Unreal Windows with
[Grotto Game Setup](../grotto-game-setup/SKILL.md).

Start gameplay before network readiness. Trust host sessions and keep wallet
snapshots private. Preserve local progress with version-aware saves.
For registered-user tips, read [actions](references/actions.md); supply the
username and exact HERESY amount, letting the host resolve the wallet and
review the recipient profile. Enforce scopes and expiry. Consume multiplayer tickets once;
room routing grants no
authority.

In Studio, use the installed runtime without asking the creator for a game ID.
The host binds the game to the session; if game code needs the public ID for an
external integration, read `client.runtime.gameId` after
`const client = await window.GrottoRuntime.ready()`. Keep `sessionId` private.

Read only what the decision needs:

| When | Read |
| --- | --- |
| Planning the next pass | [repeatable workflow](references/workflow.md) |
| Engine, input and asset capabilities | [studio-capabilities](references/studio-capabilities.md) |
| Controls, UI, resources, pause/restart | [control and lifecycle foundations](references/control-foundations.md) |
| Startup and trusted identity | [identity-and-boot](references/identity-and-boot.md) |
| Saves, conflicts or leaderboards | [saves-and-scores](references/saves-and-scores.md) |
| Inventory, events, presence or multiplayer | [capabilities](references/capabilities.md) |
| Player-reviewed transactions | [player-reviewed actions](references/actions.md) |
| Standalone or hosted games | [hosting](references/hosting.md) |
| Raw API and runtime errors | [api-and-errors](references/api-and-errors.md) |
| Packaging and security | [packaging](references/packaging.md) |

In Studio, use read_skill {name, resource} and follow nextOffset when needed.
Reads do not authorize builds or publication.
