---
name: grotto-game-feel-juice
description: "Refine game responsiveness and feedback through repeated hypothesis-driven tuning passes on movement, combat and rewards."
compatibility: "Renderer-independent; respect accessibility settings and the creator budget."
license: MIT
metadata:
  display_name: "Game feel and feedback"
  category: game-development
  stage: polish
  outcome: "Responsive actions and readable effects that fit the intended style."
  repeat_when: "After movement, combat, reward or feedback changes, and when playtests reveal weak response."
  inputs: "The intended feel, current parameters, a representative action and prior player observations."
  carry_forward: "Parameter snapshots, feedback priorities and comparable action/recovery test cases."
  version: "1.0.2"
  author: "Grotto"
  hermes:
    tags: [feel, juice, polish, hitstop, screenshake, feedback, responsive, satisfying]
    related_skills: [grotto-game-audio, grotto-game-playtest]
---

# Game Feel Juice


Start from the creator's intended experience and the installed game. Keep working mechanics, engine, art direction and save identity unless the requested change needs to alter them. Use the reference that resolves the current decision; a small change does not need every guide.

| When | Read |
| --- | --- |
| Planning another pass and carrying its evidence forward | [repeatable workflow](references/workflow.md) |
| Finding why movement, combat or rewards feel weak | [diagnosis](references/diagnosis.md) |
| Tuning effects, audio, UI response and reduced motion | [feedback-and-audio](references/feedback-and-audio.md) |

In Studio, use read_skill {name, resource} for linked references. Read only what
this pass needs; follow nextOffset if truncated. Reading does not authorize a
build or publication.
