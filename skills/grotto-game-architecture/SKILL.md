---
name: grotto-game-architecture
description: "Structure game state, simulation clocks and lifecycle ownership; repair restart duplication or stale asynchronous work."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.0"
  display_name: "Game architecture"
  category: game-development
  stage: build
  outcome: "One owner for game state, consistent timing and clean restart lifecycles."
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
| Choosing state ownership, transitions or clocks | [state-and-time](references/state-and-time.md) |
| Fixing loading, teardown, duplicate listeners or restart | [lifecycle](references/lifecycle.md) |

In Studio, use read_skill with this name and resource: "references/<file>.md".
Outside Studio, follow the relative links. Reading a guide does not spend credit,
start a build or authorize publication. Implement, inspect and report the actual
result and any unverified behavior.
