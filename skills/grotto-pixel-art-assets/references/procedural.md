# Drawing deterministic sprites or tiles in code

## 1. Draw pixel art in CODE — free, deterministic, scalable (DEFAULT)

Most game art (characters, tiles, items, UI, particles) is flat, blocky, and
small. That is *cheaper and better* to draw with code than to generate: it costs
nothing, never varies between runs, scales to any size, and is trivially
recolorable / animatable. Define a sprite as a grid of palette indices and paint
it to an offscreen `<canvas>` once, then use that canvas as your image/texture.

```js
// A 16-color palette (index 0 = transparent).
const PAL = [null,'#1a1c2c','#5d275d','#b13e53','#ef7d57','#ffcd75','#a7f070',
             '#38b764','#257179','#29366f','#3b5dc9','#41a6f6','#73eff7','#f4f4f4','#94b0c2','#566c86'];

// Each row is a string; each char is a hex index into PAL (' ' or '0' = clear).
const HERO = [
  '0004400','0044440','0049940','0044440','0445544','4444444','0440440','0400040',
];

/** Paint an index-grid sprite to a crisp canvas, scaled by `s`. Returns the canvas. */
function drawSprite(rows, pal, s = 4) {
  const h = rows.length, w = rows[0].length;
  const c = document.createElement('canvas');
  c.width = w * s; c.height = h * s;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const col = pal[parseInt(rows[y][x], 16)];
    if (!col) continue;                       // transparent
    g.fillStyle = col; g.fillRect(x * s, y * s, s, s);
  }
  return c;
}

const heroCanvas = drawSprite(HERO, PAL, 6);  // use as ctx.drawImage source, CSS bg, or a texture
```

Patterns that pay off:
- **Tiles/textures:** draw a small tile to a canvas, then tile it (`createPattern`)
  or use it as a repeating texture. Add per-pixel noise for stone/grass/dirt.
- **Recolor:** swap the palette array to reskin the same sprite (team colors,
  damage flash, day/night) for free.
- **Animate:** keep several index-grids (frames) and draw the current one; or
  shift/jitter pixels procedurally.
- **Procedural detail:** seed a small PRNG and dot in highlights/shadows so
  textures aren't flat — still free, still deterministic.
