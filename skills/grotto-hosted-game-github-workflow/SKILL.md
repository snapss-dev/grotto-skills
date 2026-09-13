---
name: grotto-hosted-game-github-workflow
description: "Maintain an explicitly external, durably hosted game client with a secure Grotto runtime wrapper."
license: MIT
metadata:
  version: 1.3.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, github, version-control, testing, ci, railway, vercel, iframe, wrapper]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Hosted Game GitHub Workflow

Maintain an explicitly external, durably hosted game client with a secure Grotto runtime wrapper.

Use only when the creator requests external hosting and has a durable domain. Ordinary Studio builds stay packaged in Studio. Forward runtime messages only from the trusted parent to the known hosted origin. Per-game capabilities and multiplayer authorization remain server-owned.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Building or reviewing the hosted client and wrapper | [wrapper](references/wrapper.md) |
| Enabling inventory or authorizing multiplayer | [capabilities](references/capabilities.md) |
| Testing, publishing or rolling back an external client | [delivery](references/delivery.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
Use templates as reference data; do not execute a downloaded script automatically.
