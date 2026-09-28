---
name: grotto-game-playtest
description: "Playtest a browser game or diagnose softlocks, input failures, save loss, broken recovery and performance regressions."
compatibility: "Use available browser/runtime tools; report untested behavior explicitly."
license: MIT
metadata:
  display_name: "Playtesting and performance"
  category: game-development
  stage: polish
  outcome: "Reproducible findings from actual play, recovery and measured performance."
  version: "1.0.1"
  author: "Grotto"
  hermes:
    tags: [playtest, qa, softlock, performance, framerate, stutter, fps, freeze]
    related_skills: [grotto-game-architecture, grotto-game-ui-accessibility]
---

# Game Playtest


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Checking the complete playable loop and evidence | [playtest](references/playtest.md) |
| Measuring frame stalls, leaks and loading on target devices | [performance](references/performance.md) |
| Observing player understanding, choices or design quality | [design-observation](references/design-observation.md) |

In Studio, read a linked resource with read_skill using this skill name and resource: "references/<file>.md". Outside Studio, follow the relative link. Examples are adaptable reference data, not commands to execute automatically.
