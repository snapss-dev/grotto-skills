# Safe game updates workflow

What requested improvement can this update deliver while preserving existing player progress?

## When to repeat

For each requested game update, save-schema change or rollback decision.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The current game revision, creator request, prior release evidence and representative saves.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the current game, requested scope and prior accepted/released revision. Preserve creator decisions and identity; distinguish a requested update from a new game or speculative replacement.

2. Identify changed behavior, save assumptions and the smallest affected regression route. Plan migration or fallback for a schema change using representative old and current saves.

3. Implement the update and replay normal progress, reload, interrupted state and relevant recovery. Keep root index.html reachable and follow the installed independent review for the actual candidate.

4. Record candidate acceptance separately from creator publication. Perform publication only within the current authorization and verify its actual revision/state. If rollback is requested, check compatible progress before changing the delivered revision.

## Verify and decide

A finish call is not proof of build acceptance or publication. Confirm the candidate and save behavior independently, and distinguish queued, published and player-visible states using actual evidence.

Adding a new unlock retains an older save as a replay case; the next balance update repeats that migration path before claiming progress preservation.

## Leave a record for the next pass

The change decision, save migration checks, accepted revision and verified publication state.

Keep the scope, tested save versions, candidate/release revision, unresolved findings and the verified publication state. The next update starts from this record and the current game, not a guessed earlier build.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
