# Pacing and reachable states

Give the session a deliberate rhythm. Alternate opportunities to learn, apply
knowledge and recover where that fits the fantasy. A quiet puzzle or building
world may sustain a gentle pace; it does not need forced waves or a timer.

## Observe the encounter, not just its layout

For each beat, record the entry state, available decisions, expected duration,
pressure, consequence and exit/recovery. Include optional branches and low
resource states. The same room can become impossible with a depleted ability
or a lost key even if its geometry remains connected.

Keep checkpoints at stable, valid states. Spawn outside collision, away from
unavoidable immediate damage, and with the resources needed to continue. If
the rules intentionally permit a losing position, communicate it and provide
the appropriate retry. Preserve durable worlds from accidental destructive
reset.

For puzzle content, separate legal-state validation from hints. Define whether
undo/reset is available and what it restores. Test repeated actions, undo after
completion, consuming a key twice, switching levels mid-animation, and closing
a modal during resolution. A solved visual arrangement is not necessarily a
valid solution under the real rules.

## Validate routes with the real rules

Check required reachability under movement, collision, inventory and switch
state. Validate authored content and generated content separately. Use the
[procedural generation guide](../../grotto-procedural-generation/SKILL.md) for
seeded candidate validation and deterministic fallback.

Maintain a compact coverage set: the introductory beat, first combination,
hardest intended beat, optional branch, recovery state and known failed route.
Play on the intended camera and input type. If a route works only with a larger
desktop viewport or precise mouse positioning, it has not passed the touch path.

Compare intended and observed play. Repeated idle waiting can be a pacing bug;
brief breathing room can be intentional. Distinguish them by player intent and
observation, not by imposing a fixed encounter duration. Save the revision and
reproduction steps with each finding. Explain which route was exercised rather
than claiming every level is fair after one walkthrough.
