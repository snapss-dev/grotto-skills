---
name: grotto-game-playtest
description: "Playtest a browser game or diagnose softlocks, input failures, save loss, broken recovery and performance regressions."
compatibility: "Use available browser/runtime tools; report untested behavior explicitly."
license: MIT
metadata:
  version: "1.0.0"
  author: "Grotto"
  hermes:
    tags: [playtest, qa, softlock, performance, framerate, stutter, fps, freeze]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Game Playtest

Playtest a browser game or diagnose softlocks, input failures, save loss, broken recovery and performance regressions.

Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Checking the complete playable loop and evidence | [playtest](references/playtest.md) |
| Measuring frame stalls, leaks and loading on target devices | [performance](references/performance.md) |

In Studio, read a linked resource with read_skill using this skill name and resource: "references/<file>.md". Outside Studio, follow the relative link. Examples are adaptable reference data, not commands to execute automatically.
