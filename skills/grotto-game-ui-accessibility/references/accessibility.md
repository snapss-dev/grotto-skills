# Preserve the information while offering alternatives

Select accommodations for the game's actual demands and intended devices.
Keep settings available before the behavior they control. Save preferences
through the installed permitted persistence path and apply them consistently
after restart.

## Plan the options around barriers

The [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/)
recommend configurable controls, readable UI, alternatives to exclusive sound
or color cues, and settings that account for motor, sensory and cognitive
needs. Apply relevant options rather than displaying a generic accessibility
checklist.

For a camera game, offer sensitivity and appropriate motion choices. For a
timing-heavy mechanic, consider adjustable windows, slower play or a practice
mode that preserves learning. For sustained/repeated input, consider toggle or
alternative activation. A remapping UI must actually update the semantic action
map and detect conflicting bindings.

Reduced motion should preserve event information while reducing camera shake,
large displacement and decorative movement. Avoid rapid flashing. Muted play
still needs important threat and outcome information. Use redundant shapes,
labels or patterns for color-coded rules; do not merely choose a different
pair of colors and declare the issue fixed.

## Text and contrast

Keep instructions readable over moving scenes with a stable backdrop where
needed. Do not rely on text baked into tiny images. In DOM interfaces use
labels, visible focus and a sensible reading order. For dynamic announcements,
announce meaningful changes rather than every frame or every counter tick.

[W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
specifies 4.5:1 for ordinary text and 3:1 for qualifying large text. Measure
actual foreground/background combinations in each theme and game state.
Those text ratios do not establish the readability of a moving target.

## Verify the alternative path

Exercise the core interaction and recovery with keyboard-only input, muted
audio, reduced motion and the relevant assist options. Check settings persist
and menus do not break camera/input ownership. Use screen-reader checks for
the DOM controls that claim support. Include affected players where possible;
simulating an impairment or passing a static audit is not equivalent evidence.

Report which behaviors were tested and which barriers remain. Do not claim
universal accessibility or certify compliance from a short browser pass.
