---
name: grotto-game-architecture
description: "Evolve game state, simulation timing and lifecycle ownership through planned system passes, with repeatable pause, restart and loading checks."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.1"
  display_name: "Game architecture"
  category: game-development
  stage: build
  outcome: "One owner for game state, consistent timing and clean restart lifecycles."
  repeat_when: "When a system, state transition, asynchronous task or restart path changes."
  inputs: "The installed foundation, state owners, resource lifetimes and the last recovery checks."
  carry_forward: "An ownership map, transition decisions and reproducible lifecycle scenarios."
  author: "Grotto"
  hermes:
    tags: [state-machine, simulation, lifecycle, game-architecture]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Game architecture

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Choosing state ownership, transitions or clocks | [state-and-time](references/state-and-time.md) |
| Fixing loading, teardown, duplicate listeners or restart | [lifecycle](references/lifecycle.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
