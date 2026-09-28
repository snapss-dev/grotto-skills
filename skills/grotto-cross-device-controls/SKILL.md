---
name: grotto-cross-device-controls
description: "Maintain desktop and touch controls through recurring action-map, layout, multitouch and input-recovery passes as mechanics evolve."
license: MIT
metadata:
  display_name: "Cross-device controls"
  category: game-development
  stage: build
  outcome: "Keyboard, pointer and touch actions that recover cleanly after interruptions."
  repeat_when: "Whenever player actions, camera framing, HUD layout or device support changes."
  inputs: "The semantic action map, target devices, current controls and previous recovery cases."
  carry_forward: "Action bindings, device coverage, layout constraints and interruption replay cases."
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
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Choosing controls or connecting semantic actions | [actions](references/actions.md) |
| Implementing a joystick or simultaneous touch actions | [touch](references/touch.md) |
| Fixing layout, input recovery or testing devices | [layout-and-review](references/layout-and-review.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
