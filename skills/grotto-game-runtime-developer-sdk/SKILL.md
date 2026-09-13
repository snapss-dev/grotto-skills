---
name: grotto-game-runtime-developer-sdk
description: "Integrate or debug Grotto identity, cloud saves, scores, events, or capability-gated multiplayer."
license: MIT
metadata:
  version: 1.9.0
  author: Bob AI Mk. I
  hermes:
    tags: [progress, autosave, save, saves, score, leaderboard, grotto, game-dev, runtime-sdk, cloud-saves, leaderboards, auth, multiplayer, html5, webgl, railway, supabase]
    related_skills: [grotto-html5-game-build-system, grotto-game-api-save-system, grotto-game-token-gated-inventory, grotto-hosted-game-github-workflow]
---

# Grotto Game Runtime Developer SDK

Integrate or debug Grotto identity, cloud saves, scores, events, or capability-gated multiplayer.

Preserve Studio's installed runtime helpers. Never block game boot, input registration or animation on network readiness. Trust the host session, not player-supplied identity; keep wallet snapshots private and immutable. Use version-aware saves, preserve progress during late hydration, and handle missing capabilities or expired sessions without granting access. Multiplayer tickets are single-use; public room routing is not authorization.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Adding runtime startup or trusted identity | [identity-and-boot](references/identity-and-boot.md) |
| Implementing autosave, migration, save conflicts or leaderboards | [saves-and-scores](references/saves-and-scores.md) |
| Using inventory, events, presence or multiplayer tickets | [capabilities](references/capabilities.md) |
| Integrating standalone fallback or a hosted wrapper | [hosting](references/hosting.md) |
| Looking up raw API behavior or diagnosing runtime errors | [api-and-errors](references/api-and-errors.md) |
| Reviewing packaging, security or a complete integration example | [packaging](references/packaging.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
Use templates as reference data; do not execute a downloaded script automatically.
