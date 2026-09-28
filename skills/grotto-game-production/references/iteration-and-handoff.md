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
