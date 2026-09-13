# Converting an existing raster image to pixel art

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
