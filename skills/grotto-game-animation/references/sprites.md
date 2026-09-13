# Animated sprites in Grotto games

Choose animation where it supports readability and the intended style. Preserve intentionally static art. Pick per actor:

## Path A — generate_sprite_animation (the hero path, one billed image)
When offered by this run, the tool returns a sheet and animator. Inspect its actual frame alignment and current cost:
```js
// tool: generate_sprite_animation {prompt:"a tiny armored knight", name:"hero", action:"walk cycle", frames:4, pixel:true}
// then: <script src="assets/hero.js"></script>
const hero = window.__grottoSprites["hero"];
// each render frame:
hero.draw(ctx, hero.frameAt(elapsedSeconds), x, y, w, h, facingLeft);
// hero.frames / frameWidth / frameHeight / fps are available for custom timing;
// the sheet itself is window.__grottoAssets["hero"] if you need raw drawImage control.
```
Guidelines:
- One sheet per ACTION ("hero_walk", "hero_idle"). 4 frames reads as animated; 6-8 for showpieces.
- Describe the SUBJECT in prompt and the MOTION in action; the sheet layout is handled for you.
- Set set_art_direction first so every sheet matches the game's style.
- pixel:true gives crisp retro frames (pixelSize ~48-96).
- Freeze on a frame for hit-stun; play backwards for rewind effects: draw(ctx, anyIndex, ...).

## Path B — procedural frames (free, great for props/particles)
Define frames as data (palette + index grids painted to an offscreen canvas, or shape
variations) and advance a frame index on a timer, then draw frames[frame]:
```js
animT += dt; frame = Math.floor(animT * FPS) % frames.length;
ctx.drawImage(frames[frame], x, y);
```
For a raw sheet, draw ONE cell with the 9-arg drawImage(img, f*FW, 0, FW, FH, dx, dy, dw, dh).

## What NOT to do
Do NOT generate one image per frame — motion comes from ONE sheet (Path A, a single
billed image) or from code (Path B, free). Per-frame image calls cost more and the
frames will not line up.

## Motion polish (both paths)
- Squash on land, stretch on jump (scale 1.15/0.85 for ~80ms).
- Flip horizontally to face direction (the animator's flip arg, or ctx.scale(-1,1)).
- Decouple animation fps (8-12) from movement speed; scale fps with velocity for runs.
- ctx.imageSmoothingEnabled = false so scaled sprites stay crisp.
