# Phaser recipes: implement the requested behavior

Inspect src/game.ts and the installed declarations first. The examples below describe ownership and transitions; adapt them to the actual scene. Do not introduce a second input, save or render loop.

## Responsive platform movement

Bind actions through kit.bindActions(scene, allowedActions). Keep acceleration, maximum speed, air control, jump impulse, coyote time and jump buffer as named tuning values in simulation units. A held jump is not a new press every frame. Consume a press once; permit a buffered press just before landing and a short grace period just after walking off an edge if that fits the game. Clear the buffer on pause, death and restart. Avoid changing world gravity just to make one actor feel better.

Use Arcade Physics bodies for ordinary 2D collision. Set a collider that fits the visible feet/body; animation frames must not change the hitbox. Tune at the expected frame rate and a slower device. Verify short/long presses, edge jumps, landing while holding jump, ceilings, simultaneous touch movement/jump and cancel.

## Enemy behavior

Use explicit states such as patrol, telegraph, attack, recover and defeated. Put cooldown and target selection in state data; animation reflects those states. A new enemy should reuse the existing damage, score and spawn systems. Remove its listeners, colliders and pending timers on scene shutdown. Pool frequently spawned actors when measurement justifies it.

Make danger readable before increasing speed: show the attack area, commitment time and escape opportunity. Verify interrupted attacks, overlapping damage, leaving/reentering the scene, and restart after defeat. An enemy that looks different but adds no different decision may not improve the loop.

## Generated sprites in Phaser

Use the returned scriptTag and registry key; load the module before the game's compiled script. Use kit.loadGeneratedImage for ordinary images. For a generated sprite sheet, inspect returned frameWidth/frameHeight and the installed loader declarations. Register the sheet and animation definitions once in preload/create, then choose an animation from actor state. Do not run a Canvas draw loop over Phaser's renderer.

Preserve a stable origin, display scale and collision body across idle/run/hit frames. Test the sprite on the real background at gameplay scale. Transparency, foot placement, direction and silhouette matter more than the number of frames.

## Menus, saves and restart

Use kit.setHud and kit.showOverlay for supported score/status and recovery UI. Keep gameplay state separate from display objects. Freeze gameplay input behind overlays; an overlay's pointer event must not also attack or jump.

Restart resets transient state (timers, held actions, enemy count, camera effects) and preserves durable progression according to the game rules. A scene restart must not duplicate global listeners or save writers. Test three consecutive restart cycles and a refresh after earning progress. Call check_project after integration, then actually play the changed path.
