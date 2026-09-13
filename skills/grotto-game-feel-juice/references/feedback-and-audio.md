# Feedback that fits the game

Give important events distinct, readable consequences. A pickup, hit, near miss and failed action should not all use the same flash. Choose amplitude and duration relative to event importance. Reduce clutter when events overlap.

Screen shake, particles, easing, squash/stretch and hitstop are options. Keep camera shake as a temporary offset from the authoritative camera, reset it on pause/restart, and bound combined effects. Hitstop should pause only the intended simulation and must not freeze UI recovery or network handling. Use pools or bounded lifetimes for frequent particles.

Choose easing for the motion's purpose: overshoot may suit a reward popup but misrepresent an aiming indicator. A score count-up must not delay the underlying score or duplicate the save. Avoid effects that obscure collision timing or targets.

## Audio

Match sound to the event, vary repeated cues carefully, and limit simultaneous voices. Use existing assets or the currently available generation tools; read their actual cost/availability instead of promising that music is free. Silence can be intentional. Start/unlock audio from a user gesture, honor mute/volume, and pause or attenuate appropriately when backgrounded.

Synchronize cues with the gameplay event rather than a render loop. Rapid input should not spawn unbounded AudioNodes or restart a loop every frame. Dispose sound resources/listeners during teardown.

## Accessibility and acceptance

Respect reduced-motion preferences: reduce camera displacement, flashes and large UI movement; preserve the information through another cue. Do not make sound, vibration or color alone carry an essential instruction.

Compare feedback enabled/reduced/muted during actual play. Verify rapid combinations, overlapping events, pause/restart during hitstop, and the busiest intended scene. The target is clearer, satisfying play within the chosen style, not maximum effect count.
