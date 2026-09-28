# UI that protects play

Design from what the player must decide now. Show information near the action
it informs, keep the playfield legible, and make menus easy to enter and leave.
Do not add score, health or objectives to experiences that do not use them.

## Choose the surface deliberately

Use accessible DOM controls for text-heavy menus, settings, forms and UI-only
games when they fit the installed foundation. Canvas can render spatial HUD
elements where their relationship to the world matters. Do not migrate the
whole game into React just to add a pause button.

For Studio's ui foundation, use the installed React/shadcn components and
GrottoUI actions. Import within src using the installed conventions, bind real
mechanics to semantic actions, and unsubscribe effects on cleanup. Inspect
current declarations; do not install packages or emit acceptance signals from
a decorative click counter.

Keep HUD updates tied to meaningful state changes. Separate transient notices
from persistent state. Use full readable labels and units; avoid clipping the
information needed to decide. When space is narrow, reflow or simplify the
layout instead of shrinking everything below legibility.

## Own focus and input

Opening a menu suspends world movement/look and clears held actions. Put focus
on the menu's useful entry point. Keyboard and touch can operate every shown
action, close the menu and return to play. Native buttons and inputs supply
semantics; a clickable div needs avoidable extra work.

Preserve input focus while typing. A global Space or arrow handler must not
jump/move the actor while a text field is active. Dismissal restores focus to
the opener or another valid control. Repeated pause presses and click-through
on close must not trigger two transitions.

## Responsive interaction checks

Use safe areas, stable touch positions and a readable minimum text size chosen
for the device. Provide a non-drag alternative when dragging is not itself the
essential mechanic. A drag/select operation needs cancel and legal-target
feedback; releasing outside the object must resolve predictably.

Test zoom/reflow, long labels, portrait/landscape, keyboard focus, overlapping
menus, background/resume and rapid reopen. Check the real game surface remains
visible and usable. Accessibility is observed behavior, not an icon on a menu.

Standards basis: [W3C target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
sets a 24 CSS-pixel minimum with exceptions and spacing alternatives. Prefer
larger, comfortably separated touch controls; the minimum is not a game joystick
recommendation or a claim of complete WCAG compliance.
