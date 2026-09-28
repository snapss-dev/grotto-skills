# A coherent visual system

Start with the creator's references and intended mood. Name concrete properties:
shape language, proportions, viewpoint, palette roles, material treatment,
lighting, detail density and motion character. Terms like polished or beautiful
are not enough to coordinate several assets.

## Establish the gameplay view first

Define the actual camera and smallest expected display scale before producing
high-detail art. Identify silhouette and contrast requirements for the player,
threats, interactables and background. A model's attractive close-up cannot
establish that a small character reads from an isometric camera.

Create a short style sheet with a representative gameplay image or supplied
reference, palette roles, scale/pivot conventions and a few prohibited clashes.
Use set_art_direction before the first eligible generated image/sprite/model
when that tool is offered, then retain the style across requests. A style prompt
helps coordination; inspect the actual outputs instead of assuming consistency.

## Choose the representation by its job

| Need | Candidate method | Check before expanding |
| --- | --- | --- |
| Simple modular shape | Authored geometry or procedural art | Silhouette, repeatability and render cost |
| Crisp low-resolution art | Pixel workflow | Grid, palette, scale and filtering |
| Painted or textured surface | Raster asset workflow | Lighting/viewpoint match and alpha edges |
| Animated sprite actor | Sprite pipeline | Grid, pivot and ground baseline |
| Rigged spatial actor | Available Blender/GLB workflow | Scale, skeleton and real clip names |

These are aesthetic and functional choices, not a ladder from cheap to good.
Use the dedicated asset/animation/3D guides for implementation. A voxel tool
does not produce an animated GLB just because it makes a 3D object.

## Review one representative set

Produce a small set that proves the direction: a main actor, an interaction
target and a representative environment surface. Compare them in the actual
scene at gameplay scale, including a busy moment. Resolve viewpoint,
illumination, silhouette or palette drift before generating the entire world.

Preserve the direction while iterating. If a new asset conflicts, refine its
concrete properties instead of replacing every working asset. Record which
outputs were accepted and which need revision; successful generation does not
mean the asset is approved, readable or integrated.
