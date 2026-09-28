---
name: grotto-game-audio
description: "Design and integrate game sound, music, browser audio unlock, bounded mixing and playback cleanup within the run budget."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.0"
  display_name: "Game audio"
  category: game-development
  stage: assets
  outcome: "Intentional sound with working mute, startup, mixing and teardown."
  author: "Grotto"
  hermes:
    tags: [audio, sound, music, soundtrack, autoplay, mixing]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Game audio

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Choosing cues, music, asset sources or mix priorities | [cues-and-mix](references/cues-and-mix.md) |
| Fixing browser unlock, mute, loading or playback lifecycle | [browser-lifecycle](references/browser-lifecycle.md) |

In Studio, use read_skill with this name and resource: "references/<file>.md".
Outside Studio, follow the relative links. Reading a guide does not spend credit,
start a build or authorize publication. Implement, inspect and report the actual
result and any unverified behavior.
