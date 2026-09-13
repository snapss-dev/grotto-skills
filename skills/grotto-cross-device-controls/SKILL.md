---
name: grotto-cross-device-controls
description: "Build or repair desktop and touch controls, responsive layouts, or input recovery."
license: MIT
metadata:
  version: 1.2.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, controls, input, mobile, touch, joystick, keyboard, pointer, responsive, accessibility]
    related_skills: [grotto-core-of-gaming, grotto-game-runtime-developer-sdk]
---

# Cross-Device Game Controls

Build or repair desktop and touch controls, responsive layouts, or input recovery.

Use one semantic action model for desktop and mobile. Preserve keyboard/mouse, independent pointers, safe areas and input reset on cancel, blur, visibility change, pause and restart. The complete play and recovery loop must work on both devices.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Choosing controls or connecting semantic actions | [actions](references/actions.md) |
| Implementing a joystick or simultaneous touch actions | [touch](references/touch.md) |
| Fixing layout, input recovery or testing devices | [layout-and-review](references/layout-and-review.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
Use templates as reference data; do not execute a downloaded script automatically.
