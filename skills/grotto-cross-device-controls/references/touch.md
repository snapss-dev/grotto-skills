# Implementing a joystick or simultaneous touch actions

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
