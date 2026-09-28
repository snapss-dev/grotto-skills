---
name: grotto-game-animation
description: "Iterate character animation through recurring asset, state-transition, timing and interruption passes at gameplay scale."
compatibility: "Use the installed renderer and only asset tools offered by the current run."
license: MIT
metadata:
  display_name: "Character animation"
  category: game-development
  stage: assets
  outcome: "Stable pivots, responsive transitions and frame-rate-independent clips."
  repeat_when: "When clips, sprite sheets, movement states, facing or interruption rules change."
  inputs: "Current assets, state transitions, anchor/scale conventions and prior timing observations."
  carry_forward: "An animation-state map, timing decisions, asset bindings and interruption scenarios."
  version: "1.1.2"
  author: "Grotto"
  hermes:
    tags: [animation, animate, animated, spritesheet, walk-cycle, idle, frames]
    related_skills: [grotto-game-art-direction, grotto-game-feel-juice]
---

# Game Animation


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Generating and integrating sprite sheets | [sprites](references/sprites.md) |
| Connecting movement, frame timing, interruption and facing | [state-and-timing](references/state-and-timing.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
