# Turn a brief into a first playable

Start with the creator's intended experience and the installed project. Capture
the player fantasy, primary verbs, camera, input devices, visual direction,
session shape and constraints in a short working brief. Keep open-ended worlds
open-ended: a sandbox needs useful interactions and durable creations, not an
invented score or forced ending.

## Build the uncertain part first

Identify the decision most likely to invalidate the design: movement precision,
camera visibility, a puzzle rule, editable-world cost, or simultaneous touch
input. Make a small playable test of that risk before producing many assets or
levels. Choose a falsifiable observation, such as whether the player can see and
dodge an approaching attack from the intended camera. A large feature list is
not a testable design hypothesis.

For a new Studio game, inspect GROTTO.md and select the offered control/UI
foundation before authoring. Keep the protected engine, compiler and runtime.
Work within available tools and the actual run budget; do not install a new
engine or invent a generation result. Existing games retain their architecture
unless the requested change justifies moving it.

## Grow one complete slice

Use this dependency order, adapting it to the requested game:

1. Primary action and its visible consequence.
2. Rules that make the action meaningful, including legal and illegal actions.
3. A representative encounter, puzzle, interaction or creation.
4. Learning, pause and recovery appropriate to that experience.
5. Representative presentation, controls and persistence where needed.
6. Actual play, diagnosis and a focused revision.

Temporary shapes are useful for risk tests; replace them where the requested
art direction needs finished assets. A vertical slice demonstrates the intended
quality across these systems. It is not just a longer prototype or all of the
game's planned content.

## Keep scope observable

Maintain three lists: the current slice, acceptance observations, and deferred
ideas. Cut breadth before cutting the main interaction or recovery. Do not add
accounts, shops, multiplayer, procedural worlds or paid assets merely because
the platform offers them. Add a service when a real player need requires it.

Before expanding, observe the primary action on the intended input, one full
meaningful interaction, and its recovery. Record unresolved risks. Compiling
does not establish that the slice is playable or that a person enjoys it.

Design basis: [MDA](https://www.cs.northwestern.edu/~hunicke/MDA.pdf) connects
rules, emergent behavior and player experience. The Studio sequence above is
an adaptation: choose an intended experience, implement its causal rules, and
observe whether play produces it.
