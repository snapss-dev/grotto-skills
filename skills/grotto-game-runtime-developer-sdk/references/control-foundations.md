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
update and look listeners. Register acceptance on app.actions using real state.

2D: bind kit.bindActions(scene), create the player and call
window.GrottoControls.create2D(mode, scene, player, actions, options).
Call controls.update() from the Phaser scene update. It uses Arcade velocity,
camera follow and grounded jump contacts. Configure scene gravity/colliders for
platformers; top-down disables player gravity. Space/primary jumps. Options:
speed, jumpSpeed. Keep actions on the same binding used for acceptance.

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
