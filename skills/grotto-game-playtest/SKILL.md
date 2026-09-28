---
name: grotto-game-playtest
description: "Run repeatable browser playtest and performance passes, preserving scenarios and findings across milestones, devices and revisions."
compatibility: "Use available browser/runtime tools; report untested behavior explicitly."
license: MIT
metadata:
  display_name: "Playtesting and performance"
  category: game-development
  stage: polish
  outcome: "Reproducible findings from actual play, recovery and measured performance."
  repeat_when: "Before a milestone or release, and after changes to the playable loop or recovery paths."
  inputs: "A playable revision, the creator’s intended experience, target devices and prior failing scenarios."
  carry_forward: "A scenario suite, evidence-linked findings, measured baselines and the next review scope."
  version: "1.0.2"
  author: "Grotto"
  hermes:
    tags: [playtest, qa, softlock, performance, framerate, stutter, fps, freeze]
    related_skills: [grotto-game-architecture, grotto-game-ui-accessibility]
---

# Game Playtest


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Checking the complete playable loop and evidence | [playtest](references/playtest.md) |
| Measuring frame stalls, leaks and loading on target devices | [performance](references/performance.md) |
| Observing player understanding, choices or design quality | [design-observation](references/design-observation.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
