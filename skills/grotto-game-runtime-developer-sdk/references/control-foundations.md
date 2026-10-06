# Studio control and UI foundations

## Control foundations

Use the selected protected controller instead of reimplementing keyboard signs,
yaw/pitch or camera-relative movement. W/up moves forward, S/down backward,
A/left left, D/right right; mouse-right looks right and mouse-up looks up.
Three.js uses +Y up and -Z forward at yaw zero. Camera/controls are gameplay
plumbing: do not turn these into a collector/score/timer game unless requested.

3D: inside Grotto3D.boot, create app and player, then call
window.GrottoControls.create3D(mode, app, player, options). It registers its own
fixed-step update and follows player.position. Do not add a second movement or
camera update. Options: speed, sensitivity, yaw, pitch, eyeHeight, distance,
height, gravity, jumpSpeed, groundHeight. For terrain/collisions supply
move(displacement) to apply collision-resolved motion, isGrounded() for real
contacts, and resolveCamera(eye, desired) for third-person camera obstruction.
Default motion uses a flat ground at groundHeight (zero by default). The player
position is at the feet; place body art with an appropriate local offset.
setEnabled(false) releases input when opening menus; dispose() removes the
update and look listeners. app.dispose() automatically disposes these controls.
Use the lifecycle guidance below to pause simulation while keeping menu input alive.
Register acceptance on app.actions using real state.

2D: bind kit.bindActions(scene), create the player and call
window.GrottoControls.create2D(mode, scene, player, actions, options).
Call controls.update() from the Phaser scene update. It uses Arcade velocity,
camera follow and grounded jump contacts. Configure scene gravity/colliders for
platformers; top-down disables player gravity. Space/primary jumps. Options:
speed, jumpSpeed. Native scene pause/resume clears held input; shutdown/restart
disposes controls. setEnabled(false) gates movement for an active-scene menu.
Keep actions on the same binding used for acceptance.

## UI-only games

The ui foundation uses GrottoUI.boot(({ root, actions, signals }) => cleanup).
No Phaser/Three boot, canvas or camera is needed. src/game.ts mounts src/app.tsx;
use React state and DOM controls for the requested game. Editable shadcn Button,
Card (and sections), Input, Badge and Textarea live in src/components/ui; import
them by relative path. src/lib/utils.ts exports cn. Extend those components as
needed within the installed libraries. Do not run npm/shadcn CLI inside a game.

Use literal Tailwind classes in .tsx/.ts/HTML; Studio compiles utilities into
.grotto/build/styles/utilities.css. Keep its stylesheet link before styles/game.css.
Customize theme variables in styles/game.css. Dynamically concatenated class
names are not scanned: use a map of complete class strings. No runtime CDN or
Tailwind browser compiler is required.

Bind each real game action with actions.on('primary', handler), and call
 actions.trigger('primary') from the button's onClick and relevant key handlers.
The live handler implements mechanics/state changes and emits signals only
when those mechanics succeed. Register actions.registerAcceptance on this same
binding with real state or the requested signal. In React effects unsubscribe
handlers/acceptances on cleanup; avoid stale state closures. Keyboard entry
belongs to native accessible input/form controls. Use getPlayer/createAutosave
from GrottoRuntime in the background, as below; UI has no implicit score slot.
A blank interface, animation or input counter cannot satisfy gameplay review.

# Resource and screen lifecycle

Inspect the installed runtime and declarations first. New Studio foundations
expose `window.GrottoLifecycle.contractId === 'grotto-lifecycle@1'`. Saved games
can retain older foundations; preserve working source and do not invent missing
APIs or edit protected modules. These examples demonstrate ownership and
transitions, not a game design. Add only screens the creator's game needs.

## Three.js: pause simulation, keep menus alive

`GrottoLifecycle.forApp(app)` returns one owner for the app. `app.addUpdate`
callbacks stop while paused; rendering continues. `lifecycle.onFrame` callbacks
run at the same fixed step even while paused. Use them for pause/restart input,
not enemies, physics, timers or other gameplay. The protected controller releases
movement, drag capture and pointer lock on pause. Manual `setEnabled(false)`
stays disabled after resuming. Resume pointer lock through a real player gesture.

```ts
const lifecycle = window.GrottoLifecycle.forApp(app);
lifecycle.onFrame(() => {
  if (app.actions.consume('pause')) lifecycle.setPaused(!lifecycle.paused);
});
// A DOM resume button can use the same transition:
lifecycle.listen(resumeButton, 'click', () => lifecycle.setPaused(false));
lifecycle.own(lifecycle.onPauseChange(paused => {
  pausePanel.hidden = !paused;
  // Pause/resume game-owned audio here, if present.
}));
```

Do not poll resume only from `app.addUpdate`: that callback is paused. A pause
change clears held actions so they cannot bleed into the next input context.
Wire accessible buttons to the same real transitions as semantic actions.

## Replace a world or screen without accumulating resources

`createScope` provides `own`, `defer`, `listen` and idempotent `dispose`. Cleanup
runs in reverse ownership order and attempts every entry even if one fails;
failures are reported after cleanup. `own` returns the same resource. `defer`
returns a function that unregisters cleanup without executing it. `listen`
returns a function that removes its DOM listener and ownership registration.

```ts
const lifecycle = window.GrottoLifecycle.forApp(app);
let world: GrottoResourceScope | null = null;
let forgetWorld: (() => void) | null = null;
function replaceWorld(build: (scope: GrottoResourceScope) => void): void {
  forgetWorld?.();
  world?.dispose();
  world = window.GrottoLifecycle.createScope();
  forgetWorld = lifecycle.defer(() => world?.dispose());
  build(world);
}
```

For each world, own unsubscribe functions from `app.addUpdate`, timers (with
`defer(() => clearTimeout(timer))`), model handles, audio stop functions and DOM
listeners. Destroy/remove scene objects and release their geometry/materials
when the world ends; shared assets belong to the longer-lived app owner. Do not
own one resource in several independent scopes. Unregister replaced child scopes
from the parent so its cleanup list stays bounded across many restarts.

Load assets without blocking the initial playable frame. A late result owned by
a disposed scope is immediately released. Do not add it to a dead scene:

```ts
async function addModel(scope: GrottoResourceScope, key: string): Promise<void> {
  const model = scope.own(await kit.loadModel(key));
  if (scope.disposed) return;
  app.scene.add(model.scene);
  scope.defer(() => app.scene.remove(model.scene));
}
```

Restart must replace the world owner, reset the creator's transient game state
and return to the intended playable screen. Keep app-owned input/acceptance
registrations stable and read current game state; protected signal counters are
monotonic and must not reset. Never reboot the engine or add another renderer.
Use an explicit screen state and one transition function; shut down the previous
screen's resources before entering the next. Menus must disable gameplay input.

## Phaser: use its scene lifecycle

```ts
const scope = window.GrottoLifecycle.forScene(this);
scope.listen(menuButton, 'click', () => this.scene.pause());
// Own custom external subscriptions/timers/audio here, beyond Phaser's objects.
```

Scene shutdown/destroy disposes this scope. Calling `forScene` again in `create`
after a restart provides a fresh owner. Scene-owned Phaser objects/timers already
follow the native scene lifecycle. Protected 2D controls clear velocity/input on
pause/resume and automatically dispose on shutdown. Use `controls.setEnabled`
for an overlay while the scene remains active. Resume from an active menu scene
or DOM button, not the paused scene's update. Keep the player and collision state
inside the scene rather than retaining a dead player across restarts.

## React: effect ownership

```tsx
useEffect(() => {
  const scope = window.GrottoLifecycle.createScope();
  scope.own(actions.on('primary', () => setCount(value => value + 1)));
  return () => scope.dispose();
}, [actions]);
```

Keep callbacks current with functional updates or appropriate dependencies.
Use native form input for text entry. Give each semantic action one live owner;
switching screens should remove the previous screen's subscription. Return root
unmount cleanup from `GrottoUI.boot`; the UI runtime keeps its existing DOM
observation and independently checked gameplay evidence.

## Review before finishing

For the relevant screens, walk start, play, pause, resume, results and restart.
Repeat transitions; check that speed/timers do not multiply, input does not stick,
pause retains a responsive menu, and stale async assets cannot reappear. Test
held keys, touch cancellation and focus loss in the source review. Studio's
independent browser playtest establishes runtime completion; these patterns do
not waive creator criteria or manufacture evidence.
