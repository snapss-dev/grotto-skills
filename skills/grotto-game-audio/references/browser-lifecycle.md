# Browser audio startup and cleanup

Boot local play without waiting for audio. Keep loading, user permission,
playback and mute as separate states. An asset can be loaded while browser
policy still prevents sound.

## Unlock through a real action

[MDN autoplay guidance](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
explains that audible playback and AudioContext startup may be blocked until
user interaction. Start/resume through the real play or sound control, handle
the returned promise/state, and allow a later gesture to retry. Do not assert
that audio is playing because play() was called.

Attach unlock logic once, avoid restarting a music loop on every gesture, and
honor the player's saved mute preference before playback. If a load completes
after the user muted or left the scene, recheck current ownership and settings.
Do not queue a burst of old cues to play when permission finally arrives.

## Use the returned playback contract

Current Studio asset modules may register an effect in window.__grottoAssets
and music controls in window.__grottoMusic. Inspect the exact tool result and
installed API; synthesized and generated outputs can differ. Load the returned
module before referencing its registry entry. Do not assume a guessed audio
file exists or mix a music player API with an effect source.

Own a bounded set of playback instances or voices. Handle media play rejection,
missing sources and decode failure without blocking game input. Disconnect
finished owned AudioNodes and remove ended/listener callbacks as appropriate.
Keep shared contexts/assets alive until their real owner is disposed.

## Pause and teardown policy

Decide whether pause stops, suspends or attenuates the current track. On
backgrounding, release held input and apply the chosen audio policy. Resume
only currently relevant loops, with the latest volume preference. Restart
clears transient sounds and creates one intended music owner.

Test initial blocked playback, keyboard and pointer unlock, mute before load,
failed asset, tab background/resume, repeated restart, and scene disposal
while a load is pending. Inspect actual audible/visible states and resource
counts. A source scan containing AudioContext is not a successful sound test.
