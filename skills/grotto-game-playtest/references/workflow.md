# Playtesting and performance workflow

What must be learned or revalidated about this build before the next decision?

## When to repeat

Before a milestone or release, and after changes to the playable loop or recovery paths.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

A playable revision, the creator’s intended experience, target devices and prior failing scenarios.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the build revision, current acceptance question and the last pass’s failures. Choose a bounded scenario suite that covers the changed path and its recovery. Keep a useful control scenario for comparison.

2. Play the actual primary loop on relevant devices and input modes. Include interruption, restart, loading and saved progress when affected. Capture seeds or action sequences for failures rather than relying on a screenshot.

3. Observe player understanding separately from technical correctness. Measure performance in an identified scenario and environment; use the same route and conditions when comparing revisions.

4. Classify findings by impact and evidence, then recheck repairs in their original scenarios. Mark unexercised cases explicitly. A new pass should start from the retained suite, expanding it only for new behavior or unresolved risk.

## Verify and decide

Separate compilation, browser interaction, measured performance, player judgment and publication evidence. Do not label a test plan as completed play, or a silent console as acceptance of the game.

A checkpoint repair is accepted only after replaying the failing reload sequence and a normal checkpoint route. Those become part of the next release pass.

## Leave a record for the next pass

A scenario suite, evidence-linked findings, measured baselines and the next review scope.

Record revision, environment, scenario, actual observation, severity and supporting artifact. Retain baseline measurements and compact failing steps so later passes can establish whether behavior improved.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
