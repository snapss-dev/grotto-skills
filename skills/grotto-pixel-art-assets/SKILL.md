---
name: grotto-pixel-art-assets
description: Make great game assets cheaply — draw pixel art procedurally in code (free, deterministic), convert any image into crisp pixel art at runtime, and use cheap AI image generation for sprites/textures when you need raster art.
version: 1.0.0
author: Bob AI Mk. I
license: MIT
metadata:
  hermes:
    tags: [grotto, game-dev, pixel-art, sprite, texture, asset, art, image, canvas, palette, retro, procedural]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Pixel Art & Game Assets

Great-looking games need assets — sprites, tiles, textures, icons, backgrounds.
You have three ways to make them, cheapest first. **Reach for code before image
generation.**

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

## 2. Turn ANY image into pixel art at runtime — free, no dependencies

When you have a raster image (an AI-generated sprite, a loaded PNG, a canvas you
rendered) and want it to read as crisp pixel art, downscale it hard with
smoothing OFF, optionally snap it to a fixed palette, then upscale with
nearest-neighbor. Pure browser canvas — no libraries.

Copy `templates/pixelify.js` into your game (it's dependency-free) and call:

```js
const pixelArt = pixelify(sourceImage, { maxDim: 64, palette: PAL.filter(Boolean) });
// -> a <canvas> of crisp pixel art; use it as a draw source or a texture.
```

It (a) fits the image into a `maxDim×maxDim` grid (smaller = chunkier pixels),
(b) optionally snaps every pixel to the nearest palette color for a cohesive
look, and (c) returns a crisp upscaled canvas.

## 3. Cheap AI image generation — for rich raster art (sprites, textures, bgs)

When you genuinely need painted/photographic raster art (detailed backgrounds,
organic textures, hero portraits), generate it. **It's cheap and available on
every B.O.B. tier**, billed per image.

In Grotto Studio, call the `generate_image` tool:

```
generate_image {
  "prompt": "isometric mossy stone dungeon tile, top-down, seamless, muted palette",
  "name": "tile_stone",
  "transparent": false,
  "pixel": true,        // convert the result to crisp pixel art
  "pixelSize": 64,      // longest side of the low-res grid (smaller = chunkier)
  "colors": 24          // palette size
}
```

- It writes `assets/<name>.js`, which registers a data-URI on
  `window.__grottoAssets["<name>"]`. Add `<script src="assets/<name>.js"></script>`
  and use `window.__grottoAssets["<name>"]` as an `img.src` / CSS `url()` /
  texture source.
- `transparent: true` (default) removes the background for sprites/items/icons.
  Set `false` for full-frame backgrounds.
- `pixel: true` runs the same downscale→palette→crisp-upscale pipeline as #2 on
  the server, so the saved asset is already pixel art — perfect for retro games.
- Prefer **one** good tileable texture + procedural variation over many generated
  images: cheaper and more cohesive.

## Make pixels stay crisp (do this everywhere)

Browsers blur images when scaling. Force nearest-neighbor:

- CSS: `image-rendering: pixelated;` on `<img>`/`<canvas>` you scale up.
- Canvas 2D: `ctx.imageSmoothingEnabled = false;` before every `drawImage`.
- Three.js: `texture.magFilter = THREE.NearestFilter; texture.minFilter = THREE.NearestMipmapNearestFilter; texture.generateMipmaps = false;`

## Choosing an approach

| Need | Use |
| --- | --- |
| Characters, tiles, items, UI, particles, anything flat/blocky | **Code (#1)** — free |
| Make an existing image read as pixel art | **pixelify (#2)** — free |
| Detailed backgrounds, organic textures, portraits | **generate_image (#3)** — cheap |

Bias toward code. A game built from a tight palette + procedural sprites looks
cohesive, loads instantly, weighs almost nothing, and costs the player nothing to
generate. Use AI images to accent it, not to carry it.
