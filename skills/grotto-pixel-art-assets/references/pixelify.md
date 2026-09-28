# Converting an existing raster image to pixel art

Browser Canvas can downsample a real image, optionally quantize its colors, and
upscale the result without an external library. This is a rendering capability;
choose the resolution and palette from the game's art direction.

## Resolution and sampling

Read the loaded source's actual width and height. Fit it into a chosen maximum
dimension while preserving aspect ratio and keeping both output dimensions at
least one pixel. Set `CanvasRenderingContext2D.imageSmoothingEnabled = false`
before drawing down to the small canvas and before drawing it back up. Use
integer upscale factors when possible. CSS `image-rendering: pixelated` controls
element display; it does not change the texture's stored pixels.

Nearest-neighbor downsampling alone can discard thin details. Inspect eyes,
hands, outlines and silhouettes at the intended gameplay scale; adjust the grid
or source composition before adding filters. Do not assume that lower resolution
automatically creates coherent pixel art.

## Optional palette conversion

Use `getImageData` and `putImageData` only when the source permits Canvas pixel
reads. Cross-origin images without suitable CORS access taint the canvas, so
handle that failure and retain a usable original image. Generated registry data
URLs avoid a separate cross-origin image request.

When palette matching is wanted, map each visible pixel to a selected palette
color while preserving alpha. Transparent pixels must remain transparent. Decide
how semitransparent edges should blend on the actual background; careless
quantization produces halos. Palette matching and dithering are optional visual
choices, not required processing stages.

## Engine integration and inspection

A Canvas can be a draw source or an engine texture. Follow the installed engine's
texture API and update policy; cache static conversions instead of reading and
rewriting every pixel each frame. For Three.js pixel textures, use nearest
filtering and a compatible non-mipmap minification filter when mipmaps are off.

Check transparency, aspect ratio, palette consistency and crisp edges in the
running game at desktop and phone sizes. Keep the original asset available for
deliberate revisions instead of repeatedly pixelating an already reduced image.
