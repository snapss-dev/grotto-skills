---
name: grotto-level-design
description: "Iterate authored levels through layout, mechanic teaching, pacing and observed traversal or puzzle playtests."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.1"
  display_name: "Level design and pacing"
  category: game-development
  stage: design
  outcome: "Readable spaces, purposeful encounters and reachable recovery paths."
  repeat_when: "For each new level, or after changes to movement, encounters, checkpoints or teaching."
  inputs: "The level’s purpose, current controller and camera, layout and prior player observations."
  carry_forward: "A route and teaching plan, pacing notes, observed failure points and replay scenarios."
  author: "Grotto"
  hermes:
    tags: [level-design, encounter-pacing, tutorial, puzzle-design]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Level design and pacing

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Laying out space or teaching a mechanic | [layout-and-learning](references/layout-and-learning.md) |
| Tuning pacing, checkpoints, puzzles or route validity | [pacing-and-validation](references/pacing-and-validation.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
