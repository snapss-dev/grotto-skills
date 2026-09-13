# Stable animation timing and transitions

Drive animation from gameplay state. Movement and collision remain authoritative; the animation displays them. A static or minimally animated actor can be an intentional style choice.

Use one clock in seconds. Frame selection for a looping clip is floor(elapsedSeconds * fps) % frameCount; retain the fractional remainder. Reset elapsed time on a real state/clip change, not on every render. Clamp a non-looping action to its final frame and emit its completion once. Do not advance death/attack callbacks once per render while the final frame is held.

Use the renderer's animation system when it already provides this behavior. The [frame clock](../templates/frame-clock.js) is a small renderer-independent reference for a custom Canvas animation, not a replacement for Phaser animation or a GLB mixer.

For sprite sheets, preserve one origin, ground baseline, display scale and facing convention across clips. Check the actual returned grid; blank frames, inconsistent cell sizes and changing pivots cause jitter that more interpolation will not repair. Flip the visual around its pivot without flipping input or physics.

Pause the animation clock when the game is paused, unless the specific menu/effect is intentionally live. Decide whether visual time should follow slowed simulation. Bound unusually large resume deltas instead of replaying a minute of missed motion. Match locomotion cadence to speed if sliding is visible.

Test the first/last frame, loop boundary, attack interrupted by damage, rapid left/right changes, zero velocity, freeze/unfreeze, low frame rate, and restart. Compare the same animation after equivalent elapsed time with different update sizes.
