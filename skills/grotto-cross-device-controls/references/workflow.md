# Cross-device controls workflow

Can every required player action and recovery path still work across the target input modes?

## When to repeat

Whenever player actions, camera framing, HUD layout or device support changes.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The semantic action map, target devices, current controls and previous recovery cases.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the semantic actions and previous keyboard, pointer and touch checks. Identify new actions or changed simultaneous-input requirements before changing bindings.

2. Design the mapping and layout at the actual playfield scale. Keep input interpretation separate from mechanics, track pointers independently and reserve usable space around relevant device insets.

3. Implement the new binding or layout in the existing input owner. Handle capture, release, cancellation, blur, visibility, pause and restart at the same boundary; avoid listeners owned by multiple lifetimes.

4. Play the changed action with keyboard/mouse and touch, including simultaneous actions. Replay portrait/landscape and interruption cases that matter. Check both normal progress and recovery from held inputs.

## Verify and decide

Confirm one semantic action behaves consistently across devices, that cancelled pointers cannot leave held actions, and that UI interaction does not accidentally trigger world actions. A visible joystick is not evidence of playable touch controls.

Adding an attack to a movement game requires testing move-and-attack on separate pointers, then pointer cancellation while the other action remains held.

## Leave a record for the next pass

Action bindings, device coverage, layout constraints and interruption replay cases.

Keep action bindings, supported combinations, layout assumptions and the smallest input sequences that reproduce recovery failures. Update coverage when mechanics change instead of treating mobile support as a one-time finish task.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
