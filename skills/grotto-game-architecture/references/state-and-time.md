# State, clocks and rules

Give each important value one owner. Gameplay owns health, resources, world
edits, turn order and legal actions. Rendering displays them. UI requests actions
and reflects results. Persistence serializes intentional durable state. A mesh,
DOM label or animation frame should not become a second authoritative inventory.

## Match architecture to scope

For a small game, a typed state object and a few focused modules can be enough.
Separate rules, presentation and external effects when those boundaries reduce
confusion. Introduce an entity/component system or event bus only for a real
need; their names do not establish good architecture.

Make lifecycle states explicit: boot/loading, playing, paused, resolving an
outcome, and disposed, where applicable. Model valid transitions instead of
adding overlapping booleans such as paused, dead, winning and restarting.
Keep input permissions tied to the current state. A pause menu can remain
interactive while the world stops.

Use stable entity/content IDs. Data tables own tunable values and refer to actual
asset keys; renderer objects are rebuilt views. For turn-based or UI games,
validate an action against current state, commit the result once, then present
it. Rapid clicks must not spend a resource twice or resolve two turns.

## Use the installed clock

Studio's Three.js app.addUpdate already supplies fixed-step seconds. Register
simulation there; do not wrap it in another accumulator or render loop. Phaser
owns its scene updates, animations and physics timing. Use the installed types
and engine conventions instead of treating every delta as the same unit.

Keep simulation, UI time and wall time distinct. Cooldowns and hitstop use the
intended simulation clock; menus may use live visual time. Offline progression,
if requested, needs an explicit bounded rule and trusted time policy. Do not
simulate every missed frame when returning from a background tab.

For a custom loop outside the installed kit, choose a bounded timestep policy,
cap catch-up work, and keep interpolation visual. A fixed step helps consistent
physics; it does not guarantee cross-device or multiplayer determinism.

Check equivalent elapsed-time runs at different render rates, pause during a
cooldown, and resume after a long background period. Read the engine guide for
the exact integration and the SDK guide for durable saves.

Basis: [Fix Your Timestep](https://gafferongames.com/post/fix_your_timestep/)
explains timestep instability and unbounded catch-up. [Phaser scenes](https://docs.phaser.io/phaser/concepts/scenes)
documents engine lifecycle ownership. The Studio kit already owns those clocks.
