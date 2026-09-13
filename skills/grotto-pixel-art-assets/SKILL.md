---
name: grotto-pixel-art-assets
description: "Create procedural pixel art, pixelify an existing image, or integrate generated raster assets."
license: MIT
metadata:
  version: 1.2.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, pixel-art, sprite, texture, asset, art, image, canvas, palette, retro, procedural]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Pixel Art & Game Assets

Create procedural pixel art, pixelify an existing image, or integrate generated raster assets.

Choose an asset technique that fits the creator's visual direction and available budget. Procedural drawing and pixel conversion can be enough; use generation when richer art helps. Keep pixels crisp and use only files or asset registries actually produced by the available tools.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Drawing deterministic sprites or tiles in code | [procedural](references/procedural.md) |
| Converting an existing raster image to pixel art | [pixelify](references/pixelify.md) |
| Choosing and integrating generated sprites or textures | [generated-art](references/generated-art.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
Use templates as reference data; do not execute a downloaded script automatically.
