# Preserve a session while code changes

Current spatial Studio foundations can replace compiled game code while the
creator keeps playing. The replacement boots in a separate sandbox, imports
registered logical state, prepares the player's destination and renders before
Studio promotes it. A failed or incompatible replacement leaves the previous
game running. This is a Studio editing capability; independent review and
publication still require their own exact-source evidence.

Inspect the installed declarations before using this contract. New Three and
Phaser foundations include the protected runtime and an authored `gameplay`
registration. An older game's foundation upgrade does not discover its existing
state. Legacy JavaScript, UI-only games and custom foundations without the
required compiled artifact and state contract retain an explicit version switch.

## Register the state the game already owns

Use `lifecycle.registerState` on the existing app or scene resource scope. It
registers callbacks into the authored state owner; it is not a second store or a
cloud save. Registration returns an unsubscribe function, and disposing the
scope unregisters it automatically.

```ts
interface GrottoLiveStateRegistration<T> {
  id: string;
  version: number;
  capture(): T;
  restore(value: T): void;
  migrate?(value: GrottoLiveJson, fromVersion: number): T;
  prepare?(value: T, context: { readonly signal: AbortSignal }): Promise<void> | void;
}
```

Keep each ID stable and unique across revisions. The `grotto.` prefix belongs to
protected owners. Use a positive integer schema version; changing the shape
requires a migration that validates and converts the prior version. A missing
old owner or unsupported version rejects the replacement. New owners may keep
their candidate defaults. Preserve an old owner as a migration adapter if its
data moves into a different system.

`capture`, `migrate` and `restore` are synchronous. Values must be finite,
acyclic JSON: plain objects, dense arrays, strings, numbers, booleans and null.
Do not return `undefined`, class instances, maps, functions, DOM elements,
engine objects, GPU resources or promises. The complete transfer is bounded to
1 MiB, 128 owners including protected owners, 24 levels and 50,000 nodes. Keep
large world or asset data in its existing source/resource owner.

`prepare` can load resources needed to restore a particular state. Respect its
abort signal, release canceled work and do not mutate a discarded scene later.
Preparation is bounded; a timeout keeps the old game. Validate before modifying
state in `restore`, and restore the existing owner so its live callbacks and
references remain coherent.

The foundation's `gameState` record is only a starting owner. Put the actual
mechanics there or register additional owners as they are added. Variables kept
elsewhere are not automatically captured. Include the pieces that define the
current session, such as score, inventory, objectives, active actor IDs and
their logical states, simulation time and the random generator's current state.
Recreate render objects from stable IDs in the new scene. Do not infer state
from rendered meshes or retain references into the old sandbox.

## Player, world and time

Current protected controllers expose `captureLiveState()` and
`restoreLiveState(state)`. For streamed worlds,
`world.registerLivePlayer(lifecycle, controls)` connects that state to verified
destination residency and floating-origin conversion. It preserves motion and
camera state; `teleport` alone clears motion and is not a substitute. New
foundations include the binding and terrain-height handling. Custom physics
needs its own complete, validated controller state and restoration path.

The candidate's authored terrain, materials, model layout and generation code
remain authoritative. Transfer the player's session state, not a copy of the
old world that would overwrite B.O.B.'s changes. Distinguish an actor's stable
source ID and recipe from its current health, behavior or other session state.
Preserve procedural seeds, generator versions and random sequence state where
they determine continuing play.

Use fixed-step simulation time and remaining durations for cooldowns, objectives
and other gameplay timers. The protected transfer stops simulation updates while
the final snapshot is restored and keeps rendering. It does not serialize the
JavaScript heap or freeze arbitrary `setTimeout`, network callbacks, promises or
custom loops. Own those operations with a lifecycle, and express continuing
work as logical state that the new code can resume. Studio handoff is separate
from persistent save schema versions and cloud-save `baseVersion`; do not load
or write a save merely to move between editing frames.

## Input and menus

Use the installed semantic actions and protected controls. Studio owns one
pointer-lock surface across supported game replacements, then delivers input
through those bindings. Held movement continues without producing a fresh jump
or interact press. Custom keys still use `actions.setKeyBindings`; do not add a
second movement listener.

For an authored menu, call
`window.GrottoLiveSession.requestInputMode('cursor')`, release gameplay actions,
disable movement and move focus into native controls. Returning to gameplay can
request `'game'` from a real player gesture. Studio's Tab/chat and Escape paths
remain available. Unlocked buttons and text fields keep native browser input.
Include an open menu in registered logical state. Its restore callback should
restore the UI and request `'cursor'` mode; input intent does not transfer automatically.

Raw `pointermove` listeners inside the game iframe do not receive Studio's
parent-owned locked pointer stream. Use protected look controls and semantic
`axis('aim')` for supported interactions. Current spatial action bindings also
expose `actions.pointer()`, returning `{ x, y, dx, dy, buttons, pressedButtons,
locked }` for native and managed input. The aim coordinates are normalized to
[-1, 1]. Button masks use 1 for left, 2 for right and 4 for middle. `buttons`
reports held buttons; `pressedButtons` retains a press even if released before
the next poll. Each call consumes accumulated motion and press edges, so poll
once per frame and share that value across systems. Inspect installed types
before using it in older games. Repeated presses of the same action or button
before it is polled coalesce into one press. Do not synthesize DOM events as a claimed
trusted gesture or assume `document.hasFocus()` describes managed game input.

## Build and verify an update

After a complete, meaningful gameplay milestone, run `check_project`; batch
related edits instead of checking each file write. A successful current-source
compile can publish an immutable compiled checkpoint while the agent continues
working. Studio stages only an exact, owned checkpoint; partial file events or
an earlier build's ready status cannot launch a replacement. The creator can
continue playing while it boots. State compatibility and actual rendered
readiness determine whether it takes over.

Test with meaningful state already in progress: move or jump, gain progress,
start a cooldown, open and close a menu, then change code. Check the updated
behavior and preserved values, controls and camera. Exercise a migration and a
failed replacement, repeat updates, and check chat/focus recovery. Rendering a
replacement establishes editing readiness, not independent gameplay acceptance.
If state is unregistered or incompatible, keep the old session and explain the
remaining explicit switch instead of claiming seamless continuity.
