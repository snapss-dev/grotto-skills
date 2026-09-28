# Progression that changes decisions

Start with what the player earns, spends, unlocks and risks. This guide covers
in-game rules and pacing. Platform inventory, token ownership, real payments
and valuable rewards use the SDK's verified capability contracts; ordinary
coins do not imply an NFT integration.

## Map resources before tuning numbers

For each resource, record its unit, allowed range, sources, sinks, persistence,
and ownership. Keep a single owner for awarding and spending it. A visual
count-up displays an already committed result; it must not award currency once
per rendered frame. Define handling for repeated reward events and interrupted
transactions.

Estimate representative earning and spending rates across early, middle and
late play. State assumptions explicitly: completion rate, encounter frequency,
loss frequency and chosen purchases. Expected values are a planning aid;
players may discover strategies the estimate did not model.

## Give unlocks a purpose

Prefer new tactics, combinations, spaces or forms of expression where the
fantasy supports them. Make a next possibility understandable without forcing
a grind. For stat upgrades, compare the total effect on time-to-defeat,
survivability and resource flow; stacking several multipliers can dwarf their
individual values.

Look for dominant choices, compulsory purchases, runaway advantages, dead-end
spending and rewards that remove all remaining challenge. Preserve a feasible
path after a poor decision if recovery is part of the intended experience.
An intentional irreversible tradeoff should be communicated before commitment.

## Keep durable state coherent

Version tables and save schemas when updates change progression. Add defaults
for new fields and preserve legitimately earned progress. Do not merge balances
by taking the maximum of every field: that can refund spent resources or
duplicate rewards. Read the SDK's save guide for conflict reconciliation and
[safe updates](../../grotto-studio-game-updates/SKILL.md) for old-save fixtures.

Basis: [MDA](https://www.cs.northwestern.edu/~hunicke/MDA.pdf) illustrates how
feedback loops can concentrate advantage and reduce meaningful play. The
resource ledger and save checks here apply that lens to Studio game systems.
