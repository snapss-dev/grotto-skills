# Game audio workflow

Which player event or mix relationship needs clearer feedback in this pass?

## When to repeat

When game events, audio assets, mix priorities or playback lifecycle change.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The intended sound or silence, event-to-cue map, current mix and available asset budget.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the intended experience and current event-to-cue map. Intentional silence is valid. Identify missing information, competing voices or inconsistent priorities before requesting more assets.

2. Choose a small cue or mix change and its budget. Reuse or synthesize where suitable; use paid generation only when offered and useful within the run. Assign cues to actual events rather than decorative polling.

3. Integrate the returned audio source with the existing lifetime owner. Start from a real user gesture, handle playback rejection, honor mute and bound concurrent voices. Dispose of obsolete playback on restart or teardown.

4. Play normal and dense event sequences, then test mute, pause/resume, tab interruption and restart. Listen at useful levels and recheck whether important information survives the mix.

## Verify and decide

Verify both first playback and recovery after interruption on relevant browsers. Check duplicate cues, stuck loops, voice growth and blocked playback. Source presence alone does not prove that a player heard useful feedback.

A new rapid-fire weapon crowds out damage cues. Test voice limits and priority with that encounter before generating louder replacement sounds.

## Leave a record for the next pass

The cue map, mix priorities, mute behavior and browser playback test cases.

Keep the cue map, priority and voice-limit decisions, asset provenance, mute rules and tested browser paths. Carry intentional silent states forward so later passes do not add unwanted music.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
