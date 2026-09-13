# Validate the same world the player must traverse

Persist both a seed and generatorVersion. A changed algorithm with the same seed can produce a different world; keep the old generator, migrate deliberately, or store the generated layout for existing saves. Keep gameplay and cosmetic RNG streams separate so adding particles cannot change loot or terrain.

Check invariants on each candidate before exposing it: a legal spawn, reachable required objectives, adequate clearance, bounded world size and attainable rewards. A flood fill proves connectivity on the graph you supplied; it does not prove that a platform jump, locked door or height change is traversable. Build the graph from actual movement/collision rules. Test jump edges using the installed physics constants and clearance, and include keys/locks in the state where applicable.

The [seeded grid generator](../templates/seeded-grid.js) provides a deterministic top-down connected-grid example with bounded attempts and a fallback. Its four-neighbor connectivity is unsuitable as a platformer validator without adaptation.

On a rejected seed, record the seed and failed invariant. Retry a bounded number of candidates with deterministic derivation, then use a known playable fallback or show an actionable failure. Never spin indefinitely or silently serve a softlocked level.

Test many fixed seeds, tiny/minimum and maximum supported dimensions, saved-seed reload, generator upgrades, and known failing seeds. Include a reproducible seed in bug reports. Difficulty should increase through decisions or obstacle combinations while keeping the required path achievable; connectivity alone does not prove fairness or fun.
