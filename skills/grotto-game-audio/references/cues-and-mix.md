# Sound that serves the experience

Start with the creator's tone and the information the player needs. List
important events, their relative priority and the intended sound treatment.
Silence can be a deliberate choice. A soundtrack is not required for every
game, and generation cost depends on the tools and model offered in this run.

## Choose sources within the real budget

Reuse suitable existing assets first. Studio may offer synthesized presets,
procedural music or paid generated excerpts; inspect the current tool schema,
availability and budget before requesting them. Use exact returned keys and
script tags. A failed generation is not an asset, and a guessed filename cannot
repair it.

For generated loops, inspect the start/end seam, transient attack, level and
duration in actual playback. A nominal loop flag does not make an abrupt excerpt
seamless. Keep the asset's tool receipt and licensing/provenance where available;
do not invent rights or availability.

## Make an event palette

Distinguish accepted action, rejected action, damage, reward and recovery. Map
cues to committed game events rather than render updates or button appearance.
The player should be able to tell an important warning from an incidental
pickup. Vary repeated cues sparingly, with consistent identity.

Set independent music/effects/voice controls where those channels exist. Keep
warnings and speech legible, duck background sound if needed, and inspect the
mix during the busiest intended sequence. Limit voices per cue and globally;
prioritize or drop cosmetic repeats before essential feedback. Creating an
unbounded clone for every held-input frame is not a mixing strategy.

Use envelopes or short fades to avoid abrupt changes where the playback path
supports them. Do not derive audio volume from a gameplay value without a
declared mapping and cap. Preserve mute when restarting or changing tracks.

## Evaluate with and without sound

Listen on a representative device at a reasonable level. Exercise overlapping
events, rapid input, the loop seam, pause and scene transition. Keep essential
information visible when muted. Compare the intended emotional tone with the
actual mix; more simultaneous sound can make a game less readable.

Basis: [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
describes user control and robust browser audio use. The cue priorities and
Studio budget policy here are design decisions for this workflow.
