---
name: grotto-game-runtime-developer-sdk
description: "Maintain Grotto identity, saves, scores, capability-scoped services and typed player actions through recurring integration and contract-verification passes."
license: MIT
metadata:
  display_name: "Runtime SDK"
  category: platform-integration
  stage: connect
  outcome: "Trusted identity, version-aware cloud saves and player-reviewed Grotto actions."
  repeat_when: "When a service contract, SDK usage, save schema or capability requirement changes."
  inputs: "The installed runtime, required services and prior identity/save scenarios."
  carry_forward: "Service requirements, save-version decisions and contract/recovery cases."
  version: 1.14.2
  author: Bob AI Mk. I
  hermes:
    tags: [progress, autosave, save, saves, score, leaderboard, runtime-sdk, cloud-saves, leaderboards, auth, multiplayer, transactions, mint, marketplace, crowdfund]
    related_skills: [grotto-game-token-gated-inventory, grotto-hosted-game-github-workflow, grotto-studio-game-updates]
---

# Runtime SDK

Select the browser or Unreal Windows adapter with
[Grotto Game Setup](../grotto-game-setup/SKILL.md).

Reuse installed helpers and start gameplay before network readiness. Trust host sessions; keep wallet snapshots private and immutable. Use version-aware saves without losing local progress. Enforce scopes and expiry. Consume multiplayer tickets once; room routing grants no authority.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Planning the next pass | [repeatable workflow](references/workflow.md) |
| Engine, input and asset capabilities | [studio-capabilities](references/studio-capabilities.md) |
| Camera/controls, React UI, resource ownership and pause/restart | [control and lifecycle foundations](references/control-foundations.md) |
| Startup and trusted identity | [identity-and-boot](references/identity-and-boot.md) |
| Autosave, migration, conflicts or leaderboards | [saves-and-scores](references/saves-and-scores.md) |
| Inventory, events, presence or multiplayer | [capabilities](references/capabilities.md) |
| Marketplace, mint or crowdfund action | [player-reviewed actions](references/actions.md) |
| Standalone fallback or hosted wrappers | [hosting](references/hosting.md) |
| Raw API and runtime errors | [api-and-errors](references/api-and-errors.md) |
| Packaging, security and integration | [packaging](references/packaging.md) |

In Studio, read needed pages with read_skill {name, resource}; follow nextOffset
if truncated. Reads do not authorize builds or publication.
