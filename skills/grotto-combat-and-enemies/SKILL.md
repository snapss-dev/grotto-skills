---
name: grotto-combat-and-enemies
description: "Build readable attacks, hit resolution, enemy decisions and navigation that support the intended combat experience."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.0"
  display_name: "Combat and enemy behavior"
  category: game-development
  stage: build
  outcome: "Predictable hit rules and enemies with readable, purposeful behavior."
  author: "Grotto"
  hermes:
    tags: [enemy-ai, combat-design, hitbox, telegraph, pathfinding]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Combat and enemy behavior

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Defining attack phases, damage or threat readability | [combat-contract](references/combat-contract.md) |
| Authoring enemy decisions, sensing or navigation | [enemy-decisions](references/enemy-decisions.md) |

In Studio, use read_skill with this name and resource: "references/<file>.md".
Outside Studio, follow the relative links. Reading a guide does not spend credit,
start a build or authorize publication. Implement, inspect and report the actual
result and any unverified behavior.
