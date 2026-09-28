---
name: grotto-game-audio
description: "Iterate a game’s cue map, mix and browser playback lifecycle through recurring audio passes that respect creator intent and run budget."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.1"
  display_name: "Game audio"
  category: game-development
  stage: assets
  outcome: "Intentional sound with working mute, startup, mixing and teardown."
  repeat_when: "When game events, audio assets, mix priorities or playback lifecycle change."
  inputs: "The intended sound or silence, event-to-cue map, current mix and available asset budget."
  carry_forward: "The cue map, mix priorities, mute behavior and browser playback test cases."
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
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Choosing cues, music, asset sources or mix priorities | [cues-and-mix](references/cues-and-mix.md) |
| Fixing browser unlock, mute, loading or playback lifecycle | [browser-lifecycle](references/browser-lifecycle.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
