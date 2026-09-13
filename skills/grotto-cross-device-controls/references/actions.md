# Choosing controls or connecting semantic actions

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
