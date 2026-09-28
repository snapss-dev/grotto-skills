---
name: grotto-combat-and-enemies
description: "Develop combat and enemy behavior in repeated encounter passes covering attack rules, telegraphs, decisions, navigation and player readability."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.1"
  display_name: "Combat and enemy behavior"
  category: game-development
  stage: build
  outcome: "Predictable hit rules and enemies with readable, purposeful behavior."
  repeat_when: "For each enemy or encounter, and after attack, camera, movement or damage changes."
  inputs: "Attack rules, enemy roles, the current encounter and the previous readability findings."
  carry_forward: "Attack phase contracts, enemy-role decisions and reproducible encounter cases."
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
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Defining attack phases, damage or threat readability | [combat-contract](references/combat-contract.md) |
| Authoring enemy decisions, sensing or navigation | [enemy-decisions](references/enemy-decisions.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
