// pixelify.js — turn any image into crisp pixel art, in the browser, with zero
// dependencies. Drop this into a Grotto game and call pixelify(...).
//
// Pipeline: hard-downscale to a small grid (smoothing OFF so edges stay sharp) ->
// optionally snap every pixel to the nearest color in a fixed palette -> upscale
// back with nearest-neighbor. Returns a <canvas> you can drawImage(), use as a
// CSS background, or feed to a WebGL/Three.js texture.
//
// Works on anything drawable: HTMLImageElement, HTMLCanvasElement, ImageBitmap,
// or window.__grottoAssets["key"] (a data URL — load it into an Image first).

/**
 * @param {CanvasImageSource} source  loaded image / canvas / bitmap
 * @param {object} [opts]
 * @param {number} [opts.maxDim=64]   longest side of the low-res grid; smaller = chunkier pixels
 * @param {string[]} [opts.palette]   optional hex colors (e.g. ['#1a1c2c', ...]); pixels snap to the nearest
 * @param {number} [opts.scale]       output = lowRes * scale (crisp). Omit to restore the source size.
 * @returns {HTMLCanvasElement} crisp pixel-art canvas
 */
function pixelify(source, opts = {}) {
  const { maxDim = 64, palette = null, scale = null } = opts;
  const sw = source.width || source.naturalWidth || maxDim;
  const sh = source.height || source.naturalHeight || maxDim;
  const longest = Math.max(sw, sh, 1);
  const factor = longest > maxDim ? maxDim / longest : 1;
  const lowW = Math.max(1, Math.round(sw * factor));
  const lowH = Math.max(1, Math.round(sh * factor));

  // 1) hard downscale (no smoothing)
  const low = document.createElement('canvas');
  low.width = lowW; low.height = lowH;
  const lg = low.getContext('2d');
  lg.imageSmoothingEnabled = false;
  lg.drawImage(source, 0, 0, lowW, lowH);

  // 2) optional palette snap
  if (palette && palette.length) {
    const pal = palette.map(hexToRgb);
    const img = lg.getImageData(0, 0, lowW, lowH);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 8) { d[i + 3] = 0; continue; } // keep transparency
      const [r, g, b] = nearest(pal, d[i], d[i + 1], d[i + 2]);
      d[i] = r; d[i + 1] = g; d[i + 2] = b;
    }
    lg.putImageData(img, 0, 0);
  }

  // 3) crisp upscale
  const outW = scale ? lowW * scale : sw;
  const outH = scale ? lowH * scale : sh;
  const out = document.createElement('canvas');
  out.width = outW; out.height = outH;
  const og = out.getContext('2d');
  og.imageSmoothingEnabled = false;
  og.drawImage(low, 0, 0, outW, outH);
  return out;
}

function hexToRgb(h) {
  const s = h.replace('#', '');
  const n = parseInt(s.length === 3 ? s.replace(/./g, '$&$&') : s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function nearest(pal, r, g, b) {
  let best = pal[0], bd = Infinity;
  for (const c of pal) {
    const d = (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2;
    if (d < bd) { bd = d; best = c; }
  }
  return best;
}

// Helper: load a data URL / src into an Image (e.g. window.__grottoAssets["hero"]).
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Usage:
//   const img = await loadImage(window.__grottoAssets["hero"]);
//   const px  = pixelify(img, { maxDim: 48, palette: ['#1a1c2c','#ef7d57','#ffcd75','#41a6f6'] });
//   ctx.imageSmoothingEnabled = false;
//   ctx.drawImage(px, x, y);
