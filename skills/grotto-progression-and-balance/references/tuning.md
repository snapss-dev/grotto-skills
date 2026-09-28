# Balance with scenarios and player evidence

State the intended experience before tuning: short precision attempts,
deliberate planning, gentle exploration or something else. A fair puzzle,
combat encounter and creative sandbox need different measures.

## Use a tuning table

Put tunable values in one typed configuration with units and valid ranges.
Keep derived values derived. For each experiment, retain the revision, changed
variables, scenario and observed result. Change one relevant group at a time
so the cause remains interpretable.

Choose scenarios that expose the design: a beginner path, efficient path,
conservative path, risky strategy, minimum-resource state and late-game build.
Use a seed or replayable fixture where randomness matters. A simulated agent
can check arithmetic or reachability; it cannot establish that a person finds
the game satisfying.

## Investigate before adding difficulty

| Observation | Inspect first |
| --- | --- |
| Everyone chooses one upgrade | Opportunity cost, synergies and alternatives |
| Progress stalls after a loss | Recovery sources, required costs and pacing |
| Late-game enemies are trivial | Compounding stats and encounter decisions |
| Players fail without learning | Information, timing and understandable consequences |
| Currency accumulates unused | Useful sinks and the purpose of the resource |

Do not equate longer time-to-defeat with deeper play. Assist options can change
timing, damage or input burden while preserving the central decision. Keep
competitive/scored policies explicit if assists affect comparability; do not
invent a server scoring rule.

## Check edge cases and report limits

Verify zero/maximum resources, invalid values, duplicate awards, spending the
last unit, upgrade combinations and save/reload after a purchase. Test that
displayed prices and committed costs agree, and cancellation does not spend.

Observe players using the actual UI and controls. Record hesitations and
strategies as well as completion time. Preserve conflicting reactions and the
sample size. Report balance as an iteration supported by those scenarios,
not a universal optimum or proven improvement in retention.
