# Observe what players learn and choose

Begin with a specific design question: can a newcomer discover the first action,
does the intended choice change the outcome, or why do players abandon a route?
Choose a representative task and current revision. Keep known developer
shortcuts separate from normal player play.

## Watch before explaining

Give enough context to begin, then observe ordinary controls. Note hesitation,
wrong assumptions, ignored information, dominant strategies and recovery.
Helping the player through a confusing interaction hides the problem being
tested. If intervention becomes necessary, record where and why it happened.

Distinguish observation from interpretation. "The player tried the decorative
door three times" is evidence. "The player disliked the art" needs a different
observation or their own report. Ask neutral follow-ups about what they expected
or understood; asking whether they liked a new feature encourages agreement.

## Turn findings into changes

For each issue, record task, input/device, revision, steps, observed behavior,
likely cause, impact and uncertainty. Prioritize blocked play and lost progress,
then confusing decisions and requested style. Compare the same scenario after
a change, but include fresh players where learning from the previous version
would hide the issue.

Small samples expose useful failures; they do not establish a population-wide
improvement in fun, retention or conversion. Keep conflicting reactions instead
of averaging them into a perfect score. Automated agents can expose crashes and
exercise actions, but their completion is not human preference evidence.

## Handoff with practical limits

Report observed behavior and recommended next action. Include a short clip,
screenshots or runtime evidence when permitted and useful. A screenshot shows
the captured state, not the entire interaction. Do not collect identifying data
or add telemetry merely to run a design check.

Use [runtime playtesting](playtest.md) to verify fixes and recovery, and
[performance](performance.md) when the problem is frame stalls or resource cost.
The goal is a better-supported next decision, not a mandatory research program
for every small edit.
