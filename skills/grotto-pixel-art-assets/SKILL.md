---
name: grotto-pixel-art-assets
description: "Produce and integrate pixel art through repeatable asset batches with consistent palette, scale, anchors and actual gameplay inspection."
license: MIT
metadata:
  display_name: "Pixel art and raster assets"
  category: game-development
  stage: assets
  outcome: "Consistent, readable sprites and textures connected to real asset files."
  repeat_when: "For each sprite or tile batch, and when palette, camera scale or asset technique changes."
  inputs: "The visual rules, approved representative assets, asset roles and available budget."
  carry_forward: "Palette and scale conventions, reproducible asset recipes and integration/provenance notes."
  version: 1.3.1
  author: Bob AI Mk. I
  hermes:
    tags: [pixel-art, sprite, texture, asset, art, image, canvas, palette, retro, procedural]
    related_skills: [grotto-game-art-direction, grotto-game-animation]
---

# Pixel Art & Game Assets


Choose an asset technique that fits the creator's visual direction and available budget. Procedural drawing and pixel conversion can be enough; use generation when richer art helps. Keep pixels crisp and use only files or asset registries actually produced by the available tools.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Drawing deterministic sprites or tiles in code | [procedural](references/procedural.md) |
| Converting an existing raster image to pixel art | [pixelify](references/pixelify.md) |
| Choosing and integrating generated sprites or textures | [generated-art](references/generated-art.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
