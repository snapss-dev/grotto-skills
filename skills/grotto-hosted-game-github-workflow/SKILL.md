---
name: grotto-hosted-game-github-workflow
description: "Maintain an explicitly external, durably hosted game client with a secure Grotto runtime wrapper."
license: MIT
metadata:
  display_name: "External hosting and GitHub"
  category: platform-integration
  stage: connect
  outcome: "A durable external game client with a secure runtime wrapper and release checks."
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
| Building or reviewing the hosted client and wrapper | [wrapper](references/wrapper.md) |
| Enabling inventory or authorizing multiplayer | [capabilities](references/capabilities.md) |
| Testing, publishing or rolling back an external client | [delivery](references/delivery.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
