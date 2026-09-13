# Find the missing response before adding effects

Name the intended sensation: deliberate weight, quick precision, quiet exploration, chaotic comedy, or another creator goal. Identify one unsatisfying action and reproduce it.

Trace input -> accepted action -> state change -> visible/audio consequence -> recovery. If input is delayed or lost, fix the control path first. If the hitbox, jump apex or attack window is unclear, make the mechanic legible. Effects cannot compensate for a contradictory rule.

Useful questions:
- Does a press produce a response promptly? Are discrete actions edge-triggered?
- Can the player predict the result and explain failure?
- Does the animation display the actual collision and attack state?
- Does a pause, restart or modal leave stale input, hitstop or camera offsets?
- Is the action weak because its consequence is small, or because its feedback is missing?

For movement, expose acceleration, braking, air control and buffer/grace windows as separate parameters. For combat, expose telegraph, commitment, hit window and recovery. Change one relevant parameter family, compare the action before/after and preserve the creator's preferred difficulty.

Use a state machine when it clarifies action ownership and interruption; do not replace a working simple loop solely to add one. Success, failure and restart must remain reachable. Judge changes in actual play, including touch and a slower frame rate.
