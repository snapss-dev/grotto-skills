---
name: grotto-game-art-direction
description: "Maintain a game’s visual direction through recurring representative asset reviews, budget planning and integration at gameplay scale."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.1"
  display_name: "Art direction and asset planning"
  category: game-development
  stage: assets
  outcome: "A consistent visual direction and a verified, budgeted asset set."
  repeat_when: "At each asset batch or milestone, and when camera, palette or visual scope changes."
  inputs: "The visual brief, representative gameplay view, approved assets and available asset budget."
  carry_forward: "A visual-system decision sheet, asset provenance and an updated asset plan."
  author: "Grotto"
  hermes:
    tags: [art-direction, visual-system, asset-plan, silhouette, provenance]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Art direction and asset planning

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Choosing a coherent look or reviewing a representative set | [visual-system](references/visual-system.md) |
| Planning asset scope, budget, provenance or integration | [asset-plan](references/asset-plan.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
