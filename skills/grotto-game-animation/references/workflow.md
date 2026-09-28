# Character animation workflow

Which transition or motion cue should become clearer in this animation pass?

## When to repeat

When clips, sprite sheets, movement states, facing or interruption rules change.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

Current assets, state transitions, anchor/scale conventions and prior timing observations.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the movement-to-animation map, available frames or clips and the prior timing cases. Identify whether the problem is an asset, pivot, state or clock decision before producing more frames.

2. Choose a representative action and specify entry, loop or one-shot completion, interruption and facing behavior. Fit its timing to the mechanic; decoration should not redefine hit or movement authority.

3. Integrate the actual sheet or clip with consistent anchors and scale. Advance animation from the installed elapsed-time owner and reset state deliberately when transitions require it.

4. Play entry, repetition, interruption and recovery at relevant frame rates. Check reversals, brief input changes, pause and restart. Compare the same action with the prior pass before accepting the change.

## Verify and decide

Look for jitter, sliding, incorrect facing, repeated one-shots and completion events that fire more than intended. Test at gameplay scale; a smooth isolated strip is not proof of correct integration.

A revised attack clip must replay interruption and recovery cases so a longer animation does not leave the character in an obsolete attacking state.

## Leave a record for the next pass

An animation-state map, timing decisions, asset bindings and interruption scenarios.

Keep state/clip bindings, anchor conventions, timing parameters and compact transition sequences. Preserve the reason for any intentional mismatch between visual timing and simulation rules.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
