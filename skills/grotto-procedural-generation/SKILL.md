---
name: grotto-procedural-generation
description: "Generate reproducible playable levels, encounters or loot, and diagnose unreachable goals or unfair seeds."
compatibility: "Renderer-independent; preserve save and generator version compatibility."
license: MIT
metadata:
  display_name: "Procedural worlds"
  category: game-development
  stage: build
  outcome: "Reproducible worlds validated against the actual movement rules."
  version: "1.1.1"
  author: "Grotto"
  hermes:
    tags: [procedural, roguelike, dungeon, maze, seed, endless, generation]
    related_skills: [grotto-level-design, grotto-game-architecture]
---

# Procedural Generation


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Choosing a generator and deterministic state | [generation](references/generation.md) |
| Proving reachability, bounded retries and fair progression | [validation](references/validation.md) |

In Studio, read a linked resource with read_skill using this skill name and resource: "references/<file>.md". Outside Studio, follow the relative link. Examples are adaptable reference data, not commands to execute automatically.
