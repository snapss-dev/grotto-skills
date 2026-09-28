# Pixel art and raster assets workflow

Which small asset batch will advance the visual system without creating integration debt?

## When to repeat

For each sprite or tile batch, and when palette, camera scale or asset technique changes.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The visual rules, approved representative assets, asset roles and available budget.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review approved pixel scale, palette, silhouette and anchor conventions. Identify the gameplay role and current asset gap before choosing procedural drawing, conversion or generation.

2. Build a small representative batch with an explicit technique and budget. Retain deterministic inputs for procedural assets and source/provenance notes for converted or generated work.

3. Inspect the produced assets at actual camera scale, then bind their exact files or registry keys into the game. Verify dimensions, anchors, alpha edges and crisp sampling alongside existing assets.

4. Play the representative scene and check movement, collision fit and readability. Revise the batch’s rules before producing the remaining content; carry accepted conventions into the next batch.

## Verify and decide

Confirm that generated assets are actually drawn, pixels stay crisp under the chosen scaling and tiles/sprites fit their roles. An attractive source preview does not prove that the game uses the asset correctly.

A new enemy family first receives one representative sprite integrated beside existing characters; the remaining batch follows the approved scale and silhouette rules.

## Leave a record for the next pass

Palette and scale conventions, reproducible asset recipes and integration/provenance notes.

Keep palette/scale rules, recipe inputs, accepted representatives, filenames and provenance. Retain rejected integration cases so later batches do not repeat the same anchor or readability mistake.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.
