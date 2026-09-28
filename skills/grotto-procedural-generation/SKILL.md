---
name: grotto-procedural-generation
description: "Evolve seeded worlds through recurring generator, validity and fairness passes with retained seeds and explicit generator revisions."
compatibility: "Renderer-independent; preserve save and generator version compatibility."
license: MIT
metadata:
  display_name: "Procedural worlds"
  category: game-development
  stage: build
  outcome: "Reproducible worlds validated against the actual movement rules."
  repeat_when: "When generation rules, movement assumptions, content pools or difficulty change."
  inputs: "The generator revision, RNG streams, movement rules and a retained seed corpus."
  carry_forward: "Generator/version decisions, seed coverage, validity constraints and failing seed cases."
  version: "1.1.2"
  author: "Grotto"
  hermes:
    tags: [procedural, roguelike, dungeon, maze, seed, endless, generation]
    related_skills: [grotto-level-design, grotto-game-architecture]
---

# Procedural Generation


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Choosing a generator and deterministic state | [generation](references/generation.md) |
| Proving reachability, bounded retries and fair progression | [validation](references/validation.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
