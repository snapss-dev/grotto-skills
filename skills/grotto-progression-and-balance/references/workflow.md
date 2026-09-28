# Progression and balance workflow

Which progression choice or resource relationship needs the next tuning pass?

## When to repeat

When rewards, costs, unlocks, difficulty or saved progression change.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

Resource sources and sinks, representative player states, current parameters and prior tuning notes.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the current sources, sinks, unlock requirements and reward ownership. Reuse representative early, mid and late states, including a poor or failed run; identify the design hypothesis behind the existing values.

2. Choose a measurable question about usefulness, dominant choices, waiting or recovery. Define the relevant scenarios before changing parameters. Distinguish ordinary in-game currency from platform ownership or wallet capabilities.

3. Change one connected parameter family and record the new snapshot. Keep reward issuance idempotent and saved progression compatible. Use existing permitted diagnostics; a tuning pass does not authorize new tracking.

4. Run the same scenarios and inspect the resulting choices and recovery costs. Replay duplicate reward events, older saves and reloads where the change affects them. Keep or revise the values with their rationale.

## Verify and decide

Check impossible unlocks, runaway resource growth, duplicate grants and dominant choices in the tested scenarios. Explain assumptions and sample limits. Simulation and one successful run cannot establish long-term player satisfaction.

If an unlock requires several repetitive runs, test its cost and meaningful alternatives against representative states before increasing every reward.

## Leave a record for the next pass

A parameter snapshot, scenario results, reward invariants and the next balance hypothesis.

Keep parameter versions, scenario inputs and results, the design rationale and reward/save invariants. Preserve a baseline so the next pass can compare the same states rather than inventing a new benchmark.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
