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
  version: 1.21.0
  author: Bob AI Mk. I
  hermes:
    tags: [progress, autosave, save, saves, score, leaderboard, runtime-sdk, cloud-saves, leaderboards, auth, private-backend, api, scopes, multiplayer, transactions, mint, marketplace, crowdfund, tips, transfers]
    related_skills: [grotto-game-token-gated-inventory, grotto-hosted-game-github-workflow, grotto-studio-game-updates]
---

# Runtime SDK

Start with [integration setup](references/integration-setup.md) when choosing a launch
path or finding shared platform settings. For an existing game backend, use
[private backend verification](references/private-backend.md).

Choose browser or Unreal Windows with [Game Setup](../grotto-game-setup/SKILL.md).

Host sessions bind identity. Keep wallet snapshots and sessionId private; version
saves and enforce scopes/expiry. Start play before network readiness.
`client.joinRoom()` hosts shared state; external-server tickets grant no game authority.

Read identity-and-boot for game IDs and previews; reviewed actions for recipients,
HERESY amounts and registered operations. Verify progress and transactions separately.

Read selectively:

| When | Read |
| --- | --- |
| Shared settings, launch paths and service setup | [integration setup](references/integration-setup.md) |
| Planning | [repeatable workflow](references/workflow.md) |
| Engine, input, assets | [studio-capabilities](references/studio-capabilities.md) |
| Controls and lifecycle | [foundations](references/control-foundations.md) |
| Keep playing through code updates | [live session state](references/live-play-state.md) |
| Live worlds, B.O.B., generation | [world authoring](references/world-authoring.md) |
| Startup and trusted identity | [identity-and-boot](references/identity-and-boot.md) |
| Existing game backend or database | [private backend verification](references/private-backend.md) |
| Saves, conflicts or leaderboards | [saves-and-scores](references/saves-and-scores.md) |
| Inventory, events, multiplayer | [capabilities](references/capabilities.md) |
| Player transactions | [reviewed actions](references/actions.md) |
| Standalone or hosted games | [hosting](references/hosting.md) |
| Raw API and runtime errors | [api-and-errors](references/api-and-errors.md) |
| Exact browser method and response types | [SDK contract](references/sdk-contract.md) |
| Packaging | [packaging](references/packaging.md) |

In Studio, read_skill {name, resource}; follow nextOffset.
Reads do not authorize builds or publication.
