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

Do not infer touch capability from the user-agent. Show touch controls with
`@media (pointer: coarse), (hover: none)` and also activate them after the first
`pointerdown` whose `pointerType` is `touch`. This supports hybrid devices.

## Browser ownership and teardown

Set `touch-action: none` on the actual movement/look/action surfaces before the
gesture begins when gameplay owns their gestures. Keep scrolling enabled on
ordinary menu content where the player needs it. Changing `touch-action` after
`pointerdown` does not reclaim a gesture already assigned to browser scrolling.
Use `user-select: none` on game controls where selection would interfere, while
preserving ordinary text and form interaction in menus.

Pointer capture keeps a held action coherent when a finger leaves its visual
button. Release the correct pointer on every terminal event. Clear held values,
pending press edges and visual pressed states on window blur, document visibility
changes, control removal, scene shutdown and modal transitions that take input.
Make cleanup safe to repeat; a late `lostpointercapture` must not release a new
finger that subsequently acquired the same control. Remove listeners and release
captured pointers when disposing an authored control.

Keep coordinate spaces explicit: pointer coordinates are viewport CSS pixels;
world positions and render pixels may use different scales. Recalculate the
control's bounds after resize or orientation changes and choose whether to
cancel an in-progress gesture when its control moves. A camera look gesture must
not trigger a world edit or menu action when it ends.

For the installed kit's digital buttons, create `#touch-controls [data-action]`
elements before binding actions. Use only supported and allowed action names,
accessible labels and visibly distinct targets. The kit's buttons do not supply
a custom analog joystick automatically; author its geometry, gesture ownership
and connection to the game's action state when the requested movement needs one.
