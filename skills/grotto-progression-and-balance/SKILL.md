---
name: grotto-progression-and-balance
description: "Tune progression through recurring scenario-based passes on resource flows, unlocks, player choices and saved-state compatibility."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.1"
  display_name: "Progression and balance"
  category: game-development
  stage: design
  outcome: "Useful unlocks and resource rules tuned against representative play."
  repeat_when: "When rewards, costs, unlocks, difficulty or saved progression change."
  inputs: "Resource sources and sinks, representative player states, current parameters and prior tuning notes."
  carry_forward: "A parameter snapshot, scenario results, reward invariants and the next balance hypothesis."
  author: "Grotto"
  hermes:
    tags: [progression-balance, economy-balance, unlock, resource-sink]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Progression and balance

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Designing resources, unlocks or durable progression | [economy-and-unlocks](references/economy-and-unlocks.md) |
| Diagnosing dominant choices, grind or balance gaps | [tuning](references/tuning.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
