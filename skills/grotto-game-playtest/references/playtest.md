# Observe the complete playable loop

Start with the requested change, the exact game revision and its intended devices. Record what the creator wants to be true. Choose checks that expose that behavior and likely regressions; do not make every text edit run a full game audit.

Use an independent browser/runtime when one is available. Inspect the actual rendered game and interact through real controls. A build log, HTTP 200, source scan or static screenshot alone cannot establish playability. In Studio, preserve the existing independent review and run/tree evidence contract; self-reported success cannot replace it.

## A useful play session

- Begin from a fresh load. Identify the goal and perform the primary action using the shown controls.
- Complete a meaningful loop; reach success and failure where those states apply, then recover/restart.
- Repeat the changed interaction under rapid, held, simultaneous and cancelled input.
- Test pause/modal ownership, background/resume, resize and orientation changes relevant to the game.
- On touch, use simultaneous movement/action and verify that thumbs and safe areas do not cover important play. Mouse emulation alone does not prove multitouch.
- Earn progress, reload, and verify the game's actual save policy. Exercise late/offline save behavior with permitted fixtures when that contract changed.
- Repeat scene/restart cycles to expose accumulated listeners, timers and duplicate entities.

For each failure preserve reproduction steps, revision, seed/save fixture, viewport/input type, expected/observed behavior and relevant console/runtime evidence. Classify impact by lost progress, blocked play, unfair behavior or visual polish. Fix the cause and rerun the failed path plus affected neighbors.

Report observed pass/fail/unverified separately. A promised future playtest is not evidence. When browser tools or an authorized account are unavailable, finish static/unit checks and name the exact interaction still unverified.

## Is the game worthwhile?

Technical checks do not establish fun. In a short human or independent play session, assess whether the primary action is satisfying, decisions change outcomes, failure teaches something, challenge develops, and another attempt offers something meaningful. Preserve dissent or uncertainty instead of assigning a perfect score from source inspection.
