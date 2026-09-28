---
name: grotto-hosted-game-github-workflow
description: "Run recurring release and rollback workflows for explicitly external hosted game clients with a trusted Grotto runtime wrapper."
license: MIT
metadata:
  display_name: "External hosting and GitHub"
  category: platform-integration
  stage: connect
  outcome: "A durable external game client with a secure runtime wrapper and release checks."
  repeat_when: "For each authorized external client release, wrapper change or rollback."
  inputs: "The durable hosted origin, reviewed client revision, wrapper contract and rollback target."
  carry_forward: "Client/wrapper revisions, origin decisions, release evidence and verified rollback state."
  version: 1.4.1
  author: Bob AI Mk. I
  hermes:
    tags: [github, version-control, testing, ci, vercel, iframe, wrapper]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Hosted Game GitHub Workflow


Use only when the creator requests external hosting and has a durable domain. Ordinary Studio builds stay packaged in Studio. Forward runtime messages only from the trusted parent to the known hosted origin. Per-game capabilities and multiplayer authorization remain server-owned.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Building or reviewing the hosted client and wrapper | [wrapper](references/wrapper.md) |
| Enabling inventory or authorizing multiplayer | [capabilities](references/capabilities.md) |
| Testing, publishing or rolling back an external client | [delivery](references/delivery.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
