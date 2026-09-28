---
name: grotto-game-ui-accessibility
description: "Evolve HUDs, menus and accessible interactions through recurring task, device, focus and assist-setting reviews."
compatibility: "Use the installed Studio foundation and tools offered in the current run."
license: MIT
metadata:
  version: "1.0.1"
  display_name: "Game UI and accessibility"
  category: game-development
  stage: polish
  outcome: "Menus and game information usable across input, motion and audio preferences."
  repeat_when: "After adding a player task, changing the HUD or menus, or introducing new input and assist settings."
  inputs: "Player tasks, the current UI, target input modes and previously observed access barriers."
  carry_forward: "A task/input matrix, focus rules, assist-setting decisions and reproducible access checks."
  author: "Grotto"
  hermes:
    tags: [hud, game-menu, screen-reader, contrast, accessibility-settings]
    related_skills: [grotto-core-of-gaming, grotto-game-playtest]
---

# Game UI and accessibility

Start from the creator's request and current game. Preserve working design,
identity, saves and protected runtime helpers. Read only the reference needed
for the current decision; a small edit does not need every workflow.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Designing HUD, menus, focus or UI-only game interactions | [hud-and-menus](references/hud-and-menus.md) |
| Adding or checking accessible alternatives and settings | [accessibility](references/accessibility.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
