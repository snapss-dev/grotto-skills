# Procedural worlds workflow

Which generation rule or content distribution should this pass change?

## When to repeat

When generation rules, movement assumptions, content pools or difficulty change.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The generator revision, RNG streams, movement rules and a retained seed corpus.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the generator revision, RNG ownership and previous failing seeds. Reuse the installed movement and collision rules when defining what is reachable or valid.

2. Specify one generation or content change and its invariants. Separate gameplay RNG from presentation randomness, and define bounded retry or fallback behavior before sampling more worlds.

3. Implement the rule while preserving revisioned reproduction. Validate the movement graph and required progression where appropriate; reject invalid output without an unbounded retry loop.

4. Replay the retained seed corpus, add seeds for new failure modes and play representative outputs. Compare distribution and fairness assumptions under the same generator conditions. Revisit reachability after controller changes.

## Verify and decide

Check reproducibility, required routes, bounded attempts and relevant fairness cases. A passing seed or connected graph alone does not prove that generated spaces are interesting to play.

A jump-height change requires replaying old failure seeds and representative routes before claiming that the generator’s existing reachability checks still apply.

## Leave a record for the next pass

Generator/version decisions, seed coverage, validity constraints and failing seed cases.

Keep generator revision, seed, required parameters, validation result and failing route. Preserve the corpus across passes, separating invariant checks from subjective playtest findings.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
