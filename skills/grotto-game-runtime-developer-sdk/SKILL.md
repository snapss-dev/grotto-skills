---
name: grotto-game-runtime-developer-sdk
description: "Maintain Grotto identity, saves, scores and capability-scoped services through recurring integration and contract-verification passes."
license: MIT
metadata:
  display_name: "Runtime SDK"
  category: platform-integration
  stage: connect
  outcome: "Trusted identity, version-aware cloud saves and capability-scoped services."
  repeat_when: "When a service contract, SDK usage, save schema or capability requirement changes."
  inputs: "The installed runtime, required services and prior identity/save scenarios."
  carry_forward: "Service requirements, save-version decisions and contract/recovery cases."
  version: 1.10.1
  author: Bob AI Mk. I
  hermes:
    tags: [progress, autosave, save, saves, score, leaderboard, runtime-sdk, cloud-saves, leaderboards, auth, multiplayer]
    related_skills: [grotto-game-token-gated-inventory, grotto-hosted-game-github-workflow, grotto-studio-game-updates]
---

# Runtime SDK


Reuse installed helpers; boot, input and animation must not wait for network readiness. Trust host sessions, never client-supplied identity. Keep wallet snapshots private and immutable. Use version-aware saves and preserve local progress during late hydration. Missing scopes or expired sessions grant no access. Consume multiplayer tickets once; public room routing grants no authority.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Finding installed engine, input and asset capabilities | [studio-capabilities](references/studio-capabilities.md) |
| Adding runtime startup or trusted identity | [identity-and-boot](references/identity-and-boot.md) |
| Implementing autosave, migration, save conflicts or leaderboards | [saves-and-scores](references/saves-and-scores.md) |
| Using inventory, events, presence or multiplayer tickets | [capabilities](references/capabilities.md) |
| Integrating standalone fallback or a hosted wrapper | [hosting](references/hosting.md) |
| Looking up raw API behavior or diagnosing runtime errors | [api-and-errors](references/api-and-errors.md) |
| Reviewing packaging, security or integration requirements | [packaging](references/packaging.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
