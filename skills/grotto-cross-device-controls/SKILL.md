---
name: grotto-cross-device-controls
description: Design, implement, or review browser-game controls that work across desktop keyboard/mouse and mobile touch, including virtual joysticks, action buttons, direct manipulation, responsive HUDs, safe areas, and input recovery.
license: MIT
metadata:
  version: 1.0.0
  author: Bob AI Mk. I
  hermes:
    tags: [grotto, game-dev, controls, input, mobile, touch, joystick, keyboard, pointer, responsive, accessibility]
    related_skills: [grotto-core-of-gaming, grotto-game-runtime-developer-sdk]
---

# Cross-Device Game Controls

Build one game around semantic player actions, then bind desktop and mobile
inputs to those actions. Do not bolt touch handlers onto keyboard-only mechanics
at the end. The game loop must consume the same action state on every device.

## Start with verbs, not devices

Write down the game's two to four primary verbs before choosing controls. Keep
the mapping discoverable and preserve a keyboard path even on touch-first games.

- **Direct manipulation / puzzle / card game:** Tap, drag, swipe, or select the
  game object itself. Do not add a joystick when the world can be touched.
- **One-axis platformer:** Left/right pad plus one large jump/action button;
  keyboard uses arrows or A/D plus Space/W/Up.
- **Top-down movement:** One virtual joystick plus one or two contextual action
  buttons; keyboard uses WASD/arrows plus Space/E.
- **Twin-stick aim:** Movement joystick on the left and an aim/fire zone on the
  right. Use only when the mechanics truly need simultaneous move and aim.
- **Runner/rhythm/one-button game:** Make most of the playfield the action target
  and keep a small pause button clear of the action.
- **3D camera game:** Separate movement from camera look. Dragging the look zone
  must not also trigger movement or UI, and open menus must suspend camera input.

Default to the fewest controls that preserve the fantasy. Prefer contextual
actions (`interact` becomes `open`, `talk`, or `collect` based on proximity) over
clusters of tiny buttons.

## Use one semantic action model

Keep physical input state outside the simulation. Sample it once per simulation
step so input order and device type do not change the rules.

```js
const actions = {
  moveX: 0, moveY: 0,
  primary: { down: false, pressed: false },
  secondary: { down: false, pressed: false },
  pause: { pressed: false },
};

function press(action, down) {
  const state = actions[action];
  if (!state) return;
  if (down && !state.down) state.pressed = true;
  state.down = down;
}

function sampleActions() {
  const frame = {
    moveX: actions.moveX,
    moveY: actions.moveY,
    primaryDown: actions.primary.down,
    primaryPressed: actions.primary.pressed,
    secondaryPressed: actions.secondary.pressed,
    pausePressed: actions.pause.pressed,
  };
  actions.primary.pressed = false;
  actions.secondary.pressed = false;
  actions.pause.pressed = false;
  return frame;
}
```

Normalize movement vectors before applying speed. Keep `pressed` edges separate
from `down` state so holding a button cannot retrigger menus, jumps, or purchases
every frame.

Map keyboard centrally. Prevent browser defaults only for keys that the game
actually handles, and ignore gameplay keys while a text field or modal owns
focus.

```js
const keys = new Set();
const GAME_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'KeyA', 'KeyD', 'KeyW', 'KeyS', 'Space', 'KeyE', 'Escape',
]);
addEventListener('keydown', (event) => {
  if (event.target?.matches?.('input, textarea, select, [contenteditable]')) return;
  if (!GAME_KEYS.has(event.code)) return;
  keys.add(event.code);
  event.preventDefault();
});
addEventListener('keyup', (event) => {
  if (!GAME_KEYS.has(event.code)) return;
  keys.delete(event.code);
  event.preventDefault();
});
```

Combine keyboard and touch bindings deliberately; never let one device's reset
erase input that another device is still holding.

## Build touch controls with Pointer Events

Use Pointer Events for mouse, pen, and touch. Track each `pointerId` independently
so movement and action can be held at the same time. Capture active pointers and
handle `pointerup`, `pointercancel`, and `lostpointercapture` through the same
cleanup path.

For an analog joystick:

1. Anchor a 112–144 CSS-pixel control under the left thumb or in a fixed safe
   corner. Keep a dead zone around 10–18% of its radius.
2. On `pointerdown`, remember the pointer ID and origin; call
   `setPointerCapture(pointerId)`.
3. On `pointermove`, clamp displacement to the joystick radius, divide by the
   radius to produce `moveX/moveY` in `[-1, 1]`, and move only the visual knob.
4. On release or cancellation, zero the vector and recenter the knob.
5. Keep action buttons on the opposite side, at least 48 CSS pixels square, with
   spacing so two adjacent actions cannot be hit by one thumb.

```js
function bindStick(base, knob) {
  let pointerId = null;
  let center = { x: 0, y: 0 };
  const radius = () => Math.max(1, base.getBoundingClientRect().width * 0.36);
  const update = (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - center.x;
    const dy = event.clientY - center.y;
    const distance = Math.hypot(dx, dy);
    const scale = Math.min(1, radius() / Math.max(1, distance));
    const x = dx * scale;
    const y = dy * scale;
    knob.style.transform = `translate(${x}px, ${y}px)`;
    const dead = radius() * 0.14;
    actions.moveX = distance < dead ? 0 : x / radius();
    actions.moveY = distance < dead ? 0 : y / radius();
  };
  const release = (event) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    actions.moveX = actions.moveY = 0;
    knob.style.transform = '';
  };
  base.addEventListener('pointerdown', (event) => {
    if (pointerId !== null) return;
    pointerId = event.pointerId;
    const rect = base.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    base.setPointerCapture(pointerId);
    update(event);
    event.preventDefault();
  });
  base.addEventListener('pointermove', update);
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    base.addEventListener(type, release);
  }
}
```

Do not infer touch capability from the user-agent. Show touch controls with
`@media (pointer: coarse), (hover: none)` and also activate them after the first
`pointerdown` whose `pointerType` is `touch`. This supports hybrid devices.

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
