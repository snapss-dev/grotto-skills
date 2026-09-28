# Design playable space around the actual verbs

Begin with the intended camera and the installed movement rules. Establish
speed, collision footprint, jump/fall behavior, interaction distance and camera
limits. Build a small graybox that lets those actions happen. Decorative art
cannot repair a doorway the controller cannot traverse.

## Give each area a job

Map a short sequence of player decisions before building space. A beat may teach
a rule, test it, combine known rules, offer a choice, provide relief or reveal a
new possibility. This is a planning tool, not a mandatory formula for every
genre. An expressive sandbox can offer useful materials and discoverable
interactions rather than a linear route.

Introduce an unfamiliar rule where failure is readable and inexpensive. Let the
player demonstrate understanding before combining it with another rule. Keep
instructions near the interaction; do not explain an entire game before the
first action. A tutorial should use the real mechanic, not a disconnected demo.

Use landmarks, silhouettes, lighting and spatial contrast to help orientation.
Make interactable objects visually distinct from decorative ones. Optional
routes should offer a different decision or discovery; dead corridors add time
without necessarily adding play. Preserve enough visibility to plan from the
real camera, including mobile crops.

## Tune space as a gameplay variable

Compare travel time, decision frequency, safe areas, sightlines and recovery
distance. Difficulty can come from route choice, resource tradeoffs or known
obstacles in a new arrangement. Increasing every enemy's health does not
develop the level's primary challenge.

For precision movement, derive useful dimensions from the controller and test
the actual jump, including headroom and landing clearance. For a lock/key or
puzzle route, include required inventory and irreversible actions in the state
graph. Visual proximity or a tile flood fill alone does not prove playability.

Play from the start with normal controls and no developer teleporting. Record
where the player hesitates, misses information or cannot recover. Revise the
layout before multiplying content.

Research basis: [Dan Taylor's level-design talk](https://www.gdcvault.com/play/1019023/Ten-Principles-for-Good-Level)
frames level quality around engagement and player experience. The measurements
and Studio-specific checks here are an application, not a claimed universal recipe.
