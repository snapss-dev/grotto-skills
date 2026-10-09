# Iterate with evidence

Work from the current build, not an imagined replacement. Describe the observed
problem and the smallest useful change in player behavior. Preserve the
creator's decisions, identity and saves while improving the requested scope.

## Use a short learning cycle

Write a hypothesis, change the relevant system, compile, then play the scenario.
For example: if a player misses a jump because the landing is outside the
camera, changing damage or rewards cannot resolve the visibility problem.
Reproduce it with the real controller, adjust framing, and repeat that jump.
Keep a failing seed, old save or input sequence when it explains the issue.

Separate four kinds of evidence:

| Evidence | What it establishes |
| --- | --- |
| Source/type checks | The tested code contracts and compilation |
| Browser interaction | The actions and recovery actually exercised |
| Player observation | Understanding, preference and perceived fairness for those players |
| Release receipt | Which revision was accepted or published |

None substitutes for all the others. Do not infer fun from code, performance
from a screenshot, or publication from the agent's finish call.

## Prioritize by player impact

Fix lost progress, impossible states and blocked controls first. Next repair
unreadable rules, unfair feedback and repeated confusion. Then improve the
requested style and polish. A style change can be central to the brief; do not
dismiss it as optional just because the game runs.

Use measurements to support a question, not to replace it. Time to first action,
failed attempts or frame stalls can reveal friction. Explain the scenario and
sample; a single successful run is not a population-level retention finding.
Use existing permitted diagnostics rather than adding undisclosed tracking.

## Review the experience this game needs

Explain what the player can do, what follows from that action and why the next
action is meaningful. Finish that path before multiplying props, effects or
menus. Keep every requested criterion and preserve accepted controls,
mechanics, visual direction and saves unless the creator asks to change them.

For a world or spatial game, assess the intended play camera and the real
interaction route. Can the player distinguish a destination, obstacle or
usable object? Do large forms establish the setting while medium objects
support play and smaller details explain the place? Place objects where their
use makes sense. Improve relevant framing, depth and readable materials before
filling space with unrelated decorations. Add motion or sound when it serves
the requested experience, not merely to populate a checklist.

For a board, puzzle, clicker or interface game, assess what a player reads and
acts on. Can they understand the current phase, selected item, available moves
and consequences? Give active, unavailable and selected controls distinct
states. Keep text legible, establish a clear hierarchy and leave room for the
primary interaction. Such a game does not need a walkable world or scenic props.

In either case, make actions answer immediately. A valid action needs visible
consequences; a blocked action needs an understandable response. Keep feedback
consistent with the rules and preserve intentional silence, open-ended play
and creator-defined goals. Scores, music and forced endings are not mandatory
ingredients of a good game.

Audit the implementation against every requested behavior first. Missing
requested functionality is part of the current scope, not a future suggestion.
Then name the one player-experience gap whose correction would matter most to
this request. Describe a change to the actual system or presentation, such as
bringing the landing area into the play camera or separating selected cards
from unavailable ones. Avoid vague instructions to make the game nicer.

Apply the relevant change within the current budget, inspect affected paths and
recheck the creator criteria. If the review finds no concrete gap within scope,
finish rather than inventing more work. Subjective polish remains advisory and
must not become a new preview-repair gate.

Use actual screenshots and playtest observations when they are supplied. A
screenshot can establish visible composition but not prove that a mechanic
works. Without browser evidence, label the assessment as source review and
retain what is unverified. Never claim to have seen or played a game from its
code alone. Submit the resulting exact candidate through Studio's independent
verification; the review does not replace that boundary.

## Finish the current scope

Recheck the changed path and affected neighbors, including interruption,
restart and relevant device behavior. State what changed, what the creator can
try, and what is still unverified. Submit the actual candidate through Studio's
independent review. Creator publication remains a separate action under the
current workflow; verify the result before saying players receive the update.

Read [safe updates](../../grotto-studio-game-updates/SKILL.md) for save migration
or rollback, and [playtesting](../../grotto-game-playtest/SKILL.md) for runtime
evidence. A development workflow should guide decisions without making every
small edit pay for an entire audit.
