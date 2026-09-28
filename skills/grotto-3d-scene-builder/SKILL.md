---
name: grotto-3d-scene-builder
description: "Develop Three.js game scenes through recurring spatial, controller, model and rendering-cost passes using the installed Studio foundation."
compatibility: "Studio Three.js/Grotto3D foundation; Blender and model loading depend on the installed revision and available tools."
license: MIT
metadata:
  display_name: "Three.js worlds"
  category: game-development
  stage: build
  outcome: "A readable 3D world with coherent cameras, collision and model placement."
  repeat_when: "For each scene or model batch, and when camera, controller, collision or rendering changes."
  inputs: "The installed 3D foundation, current camera/controller, representative scene and cost measurements."
  carry_forward: "Spatial and collision conventions, model bindings and measured representative scene baselines."
  version: "1.1.2"
  author: "Grotto"
  hermes:
    tags: [3d, threejs, three, glb, rapier, mesh, low-poly]
    related_skills: [grotto-game-architecture, grotto-game-art-direction]
---

# 3D Scene Builder


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Building a readable scene, collision or reducing rendering cost | [scene-and-performance](references/scene-and-performance.md) |
| Generating, inserting, placing or animating models | [models-and-animation](references/models-and-animation.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
