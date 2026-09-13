---
name: grotto-procedural-generation
description: "Generate reproducible playable levels, encounters or loot, and diagnose unreachable goals or unfair seeds."
compatibility: "Renderer-independent; preserve save and generator version compatibility."
license: MIT
metadata:
  version: "1.0.0"
  author: "Grotto"
  hermes:
    tags: [procedural, roguelike, dungeon, maze, seed, endless, generation]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Procedural Generation

Generate reproducible playable levels, encounters or loot, and diagnose unreachable goals or unfair seeds.

Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Choosing a generator and deterministic state | [generation](references/generation.md) |
| Proving reachability, bounded retries and fair progression | [validation](references/validation.md) |
| Adapting a tested top-down connected-grid generator | [seeded-grid.js](templates/seeded-grid.js) |

In Studio, read a linked resource with read_skill using this skill name and resource: "references/<file>.md". Outside Studio, follow the relative link. Examples are adaptable reference data, not commands to execute automatically.
