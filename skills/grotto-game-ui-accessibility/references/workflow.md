# Game UI and accessibility workflow

Which player task or access barrier should this UI pass address?

## When to repeat

After adding a player task, changing the HUD or menus, or introducing new input and assist settings.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

Player tasks, the current UI, target input modes and previously observed access barriers.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the player’s current tasks, playfield needs and prior barriers. Identify information that supports a real decision and the input modes required to perform it. Retain the game’s established visual direction.

2. Choose one task or barrier, such as unreadable feedback, lost focus or an action available only through a precise gesture. Define an alternative that preserves the intended experience where possible.

3. Implement the HUD, menu or assist setting using the installed UI and semantic input owners. Specify focus entry, movement and return, pause ownership and persistence of settings. Do not duplicate the world controller in a menu.

4. Perform the task with relevant keyboard, pointer and touch input. Review small viewports, interruption and reduced-motion settings. Check the barrier addressed, then replay neighboring tasks for regressions.

## Verify and decide

Measure contrast and target sizes in the rendered UI where those rules apply. Test that alternatives do not rely solely on color, audio or animation. A checklist pass is not a blanket accessibility or conformance claim.

Adding a new inventory panel requires checking focus return and gameplay input ownership again, even if the previous menu passed those checks.

## Leave a record for the next pass

A task/input matrix, focus rules, assist-setting decisions and reproducible access checks.

Keep task/input coverage, focus and pause rules, chosen alternatives and observed failures. Update the same matrix as new tasks appear; carry untested barriers explicitly into the next pass.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
