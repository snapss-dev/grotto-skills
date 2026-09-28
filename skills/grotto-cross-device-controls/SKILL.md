---
name: grotto-cross-device-controls
description: "Build or repair desktop and touch controls, responsive layouts, or input recovery."
license: MIT
metadata:
  display_name: "Cross-device controls"
  category: game-development
  stage: build
  outcome: "Keyboard, pointer and touch actions that recover cleanly after interruptions."
  version: 1.3.1
  author: Bob AI Mk. I
  hermes:
    tags: [controls, input, mobile, touch, joystick, keyboard, pointer, responsive, accessibility]
    related_skills: [grotto-core-of-gaming, grotto-game-ui-accessibility]
---

# Cross-Device Game Controls


Use one semantic action model for desktop and mobile. Preserve keyboard/mouse, independent pointers, safe areas and input reset on cancel, blur, visibility change, pause and restart. The complete play and recovery loop must work on both devices.

Read only the reference needed for the current decision:

| When | Read |
| --- | --- |
| Choosing controls or connecting semantic actions | [actions](references/actions.md) |
| Implementing a joystick or simultaneous touch actions | [touch](references/touch.md) |
| Fixing layout, input recovery or testing devices | [layout-and-review](references/layout-and-review.md) |

In Studio, open a linked reference with `read_skill` using this skill name and
`resource: "references/<file>.md"`. Outside Studio, follow the relative link.
