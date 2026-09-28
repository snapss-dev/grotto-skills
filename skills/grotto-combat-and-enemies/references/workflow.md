# Combat and enemy behavior workflow

What decision should this enemy or attack ask the player to make?

## When to repeat

For each enemy or encounter, and after attack, camera, movement or damage changes.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

Attack rules, enemy roles, the current encounter and the previous readability findings.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the existing attack phases, hit resolution, camera and enemy roles. Identify the encounter’s intended pressure and available counterplay, including what a player can perceive before damage occurs.

2. Choose one encounter hypothesis. Specify an attack’s preparation, active and recovery behavior; define interruption and repeat-hit rules. Define the enemy’s purpose before changing every numeric parameter.

3. Implement one attack or decision change within the installed systems. Give sensing, navigation and decision changes bounded update costs. Keep hit authority separate from decorative animation and effects.

4. Replay representative spacing, overlapping threats, interruption, target loss and recovery. Observe whether players can read and respond to the threat. Recheck the encounter after a camera or movement change.

## Verify and decide

Check single-hit and multi-hit rules, invulnerability timing where applicable, telegraph visibility and a useful response to each relevant threat. Confirm stuck navigation or lost targets recover without unbounded work.

If an enemy feels unfair at close range, test whether its preparation is visible before reducing damage. Repeat that readability test when the camera changes.

## Leave a record for the next pass

Attack phase contracts, enemy-role decisions and reproducible encounter cases.

Keep phase timings and meanings, the enemy role, counterplay, tested encounter setups and the reason for tuning decisions. Preserve failing sequences so a later animation pass does not silently change hit rules.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
