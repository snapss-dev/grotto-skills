---
name: grotto-studio-game-updates
description: "Update an existing Studio game while preserving its identity, save compatibility and publication history."
license: MIT
metadata:
  display_name: "Safe game updates"
  category: game-development
  stage: ship
  outcome: "A verified update that preserves game identity and existing progress."
  version: 1.3.1
  author: Bob AI Mk. I
  hermes:
    tags: [update, iterate, publish, version, live, studio, save-migration, rollback]
    related_skills: [grotto-game-runtime-developer-sdk, grotto-hosted-game-github-workflow]
---

# Updating Your Game in Grotto Studio


Treat the current game and creator decisions as the starting point. Implement the requested change, preserve compatible saves, and keep root index.html reachable. Building, independent validation and publishing are separate states; completion text is not proof of any of them.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Editing, reviewing or publishing an existing game | [iteration](references/iteration.md) |
| Changing saved progression or recovering an older version | [save-migration](references/save-migration.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
