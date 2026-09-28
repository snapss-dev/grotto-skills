# Readable combat rules

Use this guide when combat is part of the request. Start from the player's
verbs, camera and intended pacing. Define what an attack commits the actor to,
what can interrupt it, how contact is resolved, and how the player recognizes
success or failure. Do not add fighting to an unrelated experience.

## Give an attack a contract

Represent wind-up, active contact and recovery with explicit simulation timing.
Declare cancel/interrupt rules and which actions remain legal in each phase.
Animation follows these rules. If animation markers drive a contact window,
check missing clips, skipped markers, pause and interruptions. Damage should
not depend on how often a render callback runs.

Choose hit shape, range, team/target filters and obstacle checks from the
mechanic. A melee swing usually needs a per-swing hit set; a persistent hazard
may use a declared repeat interval. Contact immunity and damage cooldowns need
one owner. Test multiple contacts in a frame so a target is not damaged twice
by duplicate collision events.

Make damage, knockback, resource use and death resolution consistent. Commit
the gameplay result once, then emit its visual/audio feedback. A dead actor
cannot continue attacking because a stale animation callback fires.

## Make threats understandable

Provide enough warning and spatial information for the intended response.
Measure wind-up and response distance against actual player motion. Telegraphs
must remain visible from the gameplay camera and differ from decorative FX.
Avoid essential information carried by sound or color alone.

When several enemies act together, account for overlapping attacks and the
player's visibility. Limit simultaneous commitments, reposition attackers or
provide off-screen information where the design requires it. Difficulty should
come from meaningful combat decisions rather than unavoidable hidden contact.

Play attack/interrupt/death boundaries, repeated input, low frame rate, pause
mid-swing and restart during an effect. Verify combat still reads with reduced
motion and muted audio. Tune responsiveness separately through
[game feel](../../grotto-game-feel-juice/SKILL.md).

Basis: [Mihir Sheth's God of War combat presentation](https://media.gdcvault.com/gdc2019/presentations/Sheth_Mihir_EvolvingCombat.pdf)
shows how camera perspective changes combat readability. Studio's small-scale
hit and lifecycle rules above are an adaptation, not that game's implementation.
