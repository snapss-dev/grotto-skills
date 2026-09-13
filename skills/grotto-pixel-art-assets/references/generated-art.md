# Choosing and integrating generated sprites or textures

## 3. Cheap AI image generation — for rich raster art (sprites, textures, bgs)

When you genuinely need painted/photographic raster art (detailed backgrounds,
organic textures, hero portraits), generate it. Use the currently available tool and its quoted cost; keep generation within the creator budget.

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
- Three.js: `texture.magFilter = THREE.NearestFilter; texture.minFilter = THREE.NearestFilter; texture.generateMipmaps = false;`

## Choose from the brief

Use provided assets when suitable. Procedural drawing is useful for simple geometric forms, deterministic variation or an intentionally pixel-based style. Generate raster art when it improves the desired look, including characters and key props; do not reserve it solely for backgrounds. Preserve the creator's chosen style, palette, scale and reference material.

Set art direction before related generation calls. Inspect the actual silhouette, transparency, perspective, lighting and scale in the game. Revise a weak asset before multiplying it. Use nearest filtering for pixel art, not indiscriminately for painted artwork. Tools must produce and register every referenced asset before it is used.
