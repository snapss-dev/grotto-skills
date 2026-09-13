# Fixing layout, input recovery or testing devices

## Protect the playfield and safe areas

Use DOM controls over the canvas/WebGL scene so buttons have semantic labels,
focus states, and stable CSS sizing. Keep the center and lower-middle playfield
clear; reserve lower-left for movement and lower-right for actions.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<div id="touch-controls" aria-label="Touch game controls">
  <div id="move-stick" aria-label="Movement joystick"><span></span></div>
  <button type="button" data-action="primary" aria-label="Primary action">A</button>
</div>
```

```css
canvas { display: block; width: 100%; height: 100%; touch-action: none; }
#touch-controls { display: none; position: fixed; inset: 0; pointer-events: none; }
#move-stick, #touch-controls button { pointer-events: auto; touch-action: none; user-select: none; }
#move-stick {
  position: absolute;
  left: max(18px, calc(env(safe-area-inset-left) + 12px));
  bottom: max(18px, calc(env(safe-area-inset-bottom) + 12px));
  width: clamp(112px, 24vw, 144px); aspect-ratio: 1; border-radius: 50%;
}
#touch-controls button {
  position: absolute;
  right: max(18px, calc(env(safe-area-inset-right) + 12px));
  bottom: max(28px, calc(env(safe-area-inset-bottom) + 22px));
  min-width: 64px; min-height: 64px; border-radius: 50%;
}
@media (pointer: coarse), (hover: none) {
  #touch-controls { display: block; }
}
html.touch-input #touch-controls { display: block; }
```

Use `env(safe-area-inset-*)` for HUD and controls. Test portrait, landscape,
notches, browser chrome, and resize/orientation changes. Use CSS pixels for
controls and translate pointer coordinates separately into canvas/world space.
Do not disable browser zoom globally; restrict `touch-action: none` to the
interactive game surface and controls.

## Reset safely and remain accessible

- Clear held input on `blur`, `visibilitychange`, pause, game-over, and modal
  open. A lost pointer or backgrounded tab must never leave movement stuck.
- Suspend gameplay and camera bindings while menus, dialogs, text fields, or
  inventory screens are open. Restore focus predictably when they close.
- Give every touch button an `aria-label`, visible pressed state, and keyboard
  equivalent. Maintain at least 44×44 CSS-pixel targets; prefer 48–64 for action
  controls.
- Respect `prefers-reduced-motion` for camera shake and animated UI. Make haptics
  optional and never rely on vibration as the only feedback.
- Keep instructions device-neutral: show bindings based on the most recently
  used input, such as “Move: WASD / drag stick,” without a tutorial wall.

## Validate both layouts before finishing

Check all of these:

- Desktop keyboard movement, primary action, pause, restart, and mouse/camera.
- Mobile touch movement and action simultaneously with distinct pointer IDs.
- One-thumb reach where appropriate; no control covers goals, hazards, dialogue,
  or critical HUD information.
- Portrait, landscape, 390×844, and a short/wide viewport; resize while playing.
- Touch cancellation, tab background/return, modal open/close, rapid taps, held
  inputs, and restart leave no stuck action.
- Controls appear on coarse/touch input but do not clutter mouse-only desktop.
- The same simulation actions, speeds, cooldowns, and rules apply to every input
  method.

A game is not cross-device merely because a canvas has a `pointerdown` listener.
The complete primary loop, including pause and recovery, must be comfortably
playable with both desktop and touch controls.
