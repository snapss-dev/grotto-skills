---
name: grotto-game-production
description: "Run a recurring Studio production cycle: review the current build, choose the next risk or milestone, develop a playable slice and carry playtest evidence forward."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.2"
  display_name: "Game production and iteration"
  category: game-development
  stage: design
  outcome: "A scoped playable slice, clear risks and an evidence-backed iteration plan."
  repeat_when: "At each milestone, after a playtest, or when scope and priorities change."
  inputs: "The creator brief, current playable build, remaining budget and findings from the previous pass."
  carry_forward: "The scope decision, tested build revision, findings and one next learning question."
  author: "Grotto"
  hermes:
    tags: [vertical-slice, first-playable, production-workflow, scope]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Game production and iteration

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Scoping a new game or its riskiest mechanic | [first-playable](references/first-playable.md) |
| Reviewing player experience, prioritizing findings or handing off a build | [iteration-and-handoff](references/iteration-and-handoff.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
