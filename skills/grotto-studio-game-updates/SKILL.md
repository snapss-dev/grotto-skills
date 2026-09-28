---
name: grotto-studio-game-updates
description: "Run a repeatable Studio update cycle that preserves game identity, save compatibility, review evidence and publication history."
license: MIT
metadata:
  display_name: "Safe game updates"
  category: game-development
  stage: ship
  outcome: "A verified update that preserves game identity and existing progress."
  repeat_when: "For each requested game update, save-schema change or rollback decision."
  inputs: "The current game revision, creator request, prior release evidence and representative saves."
  carry_forward: "The change decision, save migration checks, accepted revision and verified publication state."
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
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Editing, reviewing or publishing an existing game | [iteration](references/iteration.md) |
| Changing saved progression or recovering an older version | [save-migration](references/save-migration.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
