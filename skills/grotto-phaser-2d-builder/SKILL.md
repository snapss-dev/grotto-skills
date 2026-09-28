---
name: grotto-phaser-2d-builder
description: "Build and evolve a Studio Phaser game through repeated scene, physics, input and asset integration passes using the installed foundation."
compatibility: "Studio Phaser/Grotto2D foundation; inspect the installed declarations before using optional APIs."
license: MIT
metadata:
  display_name: "Phaser 2D games"
  category: game-development
  stage: build
  outcome: "A working 2D game with deliberate scenes, physics and state ownership."
  repeat_when: "For each new 2D capability, scene or asset batch, and after changes to physics or input."
  inputs: "The current Phaser foundation, scene ownership, requested mechanic and prior playable scenarios."
  carry_forward: "Scene and physics decisions, asset bindings and a small playable regression route."
  version: "1.1.2"
  author: "Grotto"
  hermes:
    tags: [phaser, 2d, scene, arcade, physics, platformer, tilemap]
    related_skills: [grotto-game-architecture, grotto-cross-device-controls]
---

# Phaser 2D Builder


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Choosing scenes, state ownership, physics or project files | [architecture](references/architecture.md) |
| Implementing movement, enemies, generated art or recovery | [recipes](references/recipes.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
