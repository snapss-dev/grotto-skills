# Drawing deterministic sprites or tiles in code

Procedural art is useful when the desired style benefits from precise shapes,
repeatable patterns, editable palettes or small textures. It is one capability,
not the default appearance of a Studio game. Choose it against supplied art and
the available image/model tools based on the creator's requested style.

## Representation and rendering

For pixel art, an authored index grid can describe pixels in a chosen palette.
Define the dimensions, transparent value and palette meaning explicitly. Draw
opaque cells into an offscreen Canvas with `fillRect`, preserve alpha, and turn
off smoothing. Choose the sprite's silhouette, palette and scale from the game;
there is no prescribed character or palette to copy.

Cache static drawings as textures rather than rebuilding them every frame. Keep
render scale distinct from source dimensions and collision geometry. For Phaser,
`kit.makeTexture` provides a procedural texture hook; inspect the installed
signature. Three.js can consume canvas-backed textures through its texture API.
A custom renderer can draw directly from the cached Canvas.

## Useful capabilities

- Tile a small authored texture with Canvas `createPattern` or the engine's
  repeating-texture configuration. Check seams and world-space scale.
- Replace selected palette entries for team variants or an intentional visual
  state; do not recolor simulation state or create accidental gameplay ambiguity.
- Use separate authored grids or engine animation for changing poses, preserving
  origin, ground baseline and display scale across frames.
- Add deterministic texture detail through a separate cosmetic random stream so
  revising art cannot alter terrain, encounters or rewards.

Inspect the result in the actual scene. Readable silhouette, contrast and
consistency matter more than how few pixels or lines of code produced it. If the
requested art needs painted detail, rich lighting or organic variation, use an
appropriate asset workflow instead of forcing it into a procedural pixel style.
