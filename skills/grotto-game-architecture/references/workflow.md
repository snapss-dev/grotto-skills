# Game architecture workflow

What state and resource ownership must change to support the next playable capability?

## When to repeat

When a system, state transition, asynchronous task or restart path changes.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The installed foundation, state owners, resource lifetimes and the last recovery checks.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Inspect the current foundation and trace the relevant state transitions, clocks and resource owners. Reuse its installed loop and controller rather than adding a parallel simulation or overwriting protected helpers.

2. Describe the next capability as a bounded state change. Specify who owns durable state, who renders it, and when asynchronous results are still valid. Choose the simplest transition model that expresses the actual behavior.

3. Implement the boundary and its cleanup together. Tie listeners, timers, audio, physics objects and async work to the appropriate scene or run lifetime; cancel or ignore work from an obsolete generation.

4. Replay the relevant start, pause/resume, restart and late-loading scenarios. Repeat restarts enough to expose growing listeners or resources. Compare behavior across the device timing range that matters for the game.

## Verify and decide

Confirm one authoritative owner for each changed state and clock. Check that stale work cannot mutate a replacement run and that a restart does not duplicate effects or input. Architecture diagrams alone do not establish runtime cleanup.

Adding a loading state requires testing both normal completion and leaving the scene before the asset resolves. Reuse those cases whenever the loading path changes.

## Leave a record for the next pass

An ownership map, transition decisions and reproducible lifecycle scenarios.

Keep a small ownership and transition map, the chosen lifetime rule, failing sequences and observed resource baselines. Update the existing record when ownership changes instead of adding a competing architecture document.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
