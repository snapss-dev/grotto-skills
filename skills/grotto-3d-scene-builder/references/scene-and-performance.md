# A readable, maintainable spatial game

Fresh Studio spatial projects have a revision-owned Three.js/Grotto3D foundation. Preserve platform helpers, declarations and compiled output. Keep authored world/rules in src/**/*.ts and run check_project after meaningful edits. For an API absent from the installed structural types, author a precise interface and narrow unknown; do not weaken the protected types.

## Startup and simulation ownership

`Grotto3D.boot(factory)` loads the installed Three.js revision and supplies
`{ THREE, kit }`. The factory creates and returns the game app. Call boot once.
`kit.createApp(THREE, options)` creates the engine surface in `#game-root` and
returns `scene`, `camera`, `renderer`, `actions`, `addUpdate` and `dispose`.
Options include `mode`, `camera`, `background`, `fog` and the allowed `actions`.
Use the installed declarations for their exact accepted values.

`app.addUpdate(callback)` receives fixed-step seconds and returns a removal
function. Advance simulation state there, then synchronize its visual objects.
Do not add a second render loop or fixed-step accumulator around the kit. Model
and network loading can proceed in background work after the local scene starts;
handle loading failure and disposal of late results.

## Camera and environment are authored choices

The helper's perspective camera initially views the origin from above and behind;
its isometric option uses an orthographic camera. It also supplies a background,
fog and outdoor lights. These are mutable implementation defaults. Select and
configure the actual camera position, projection, orientation, clipping, fog,
lighting and shadows for the creator's requested perspective and art direction.
The new source does not call this helper or install a game world automatically.

A first-person request needs an eye-level view and a matching look/movement
model. A strategy view needs deliberate framing and navigation. Do not keep an
angled overview simply because the helper starts there. Separate controller,
visual model and camera ownership; normalize diagonal movement, make look
sensitivity independent of frame rate and suspend look/movement behind menus.

## Full engine features and precise types

The installed structural types cover common platform operations, not every
Three.js feature. Real engine APIs such as `Vector3`, `Raycaster`, `InstancedMesh`,
geometry buffers, `scene.remove` and configurable fog remain usable. Declare
accurate authored interfaces in `src/types/game.d.ts` for the needed API surface
and narrow `unknown` at the boundary. Never weaken protected declarations or
use `any` or compiler suppression to make a design fit the existing subset.

Use raycasting for pointer or camera-directed selection when appropriate; choose
which layers/objects can be selected and check range and occlusion against game
rules. Picking a surface does not establish a valid edit or placement. Use
instanced or merged geometry when repetition warrants it; define how an instance
or face maps back to the authoritative game object. Engine capability determines
what is possible; the creator determines the game design.

## Readability before decoration

Establish scale, the intended viewpoint, navigable surfaces and readable interaction targets first. Add player visuals, camera bounds, collision and objectives only as the requested experience needs them. Select lighting for the art direction: a HemisphereLight and DirectionalLight are a useful outdoor starting point, not a required rig. Unlit/stylized materials may be the right choice. Check shadows, background contrast and occlusion from the actual gameplay camera. A screenshot from a free camera is not evidence that the player can navigate.

Load generated textures from the returned asset registry. Use TextureLoader only with real available sources; show a fallback while loading. Keep color/data texture interpretation appropriate to the material. Use nearest filtering for pixel art; when generateMipmaps is false, use a non-mipmap minFilter such as NearestFilter.

## Physics and ownership

Use Grotto3D.loadRapier when rigid bodies or reliable collision response are needed. Keep collision shapes simpler than rendered meshes. Move dynamic bodies through the physics API; synchronize the visual object afterward. Avoid teleporting the mesh independently of its body. Test slope edges, high-speed contacts, respawn inside geometry and paused/resumed simulation.

For a small bounded arcade world, the existing simple collision helper may suffice. Introduce a physics engine for a concrete need, not solely because the scene is 3D.

## Measured rendering cost

Measure frame time on the target viewport and device class. Watch renderer.info render calls, triangles and memory counts as diagnostics, not universal quotas. For repeated props share geometry/materials and use InstancedMesh when individual object behavior permits it. Reduce excessive shadow casters, postprocessing or pixel ratio after isolating the bottleneck.

Dispose owned geometry, textures, materials, listeners and model mixers on removal or scene teardown. Do not dispose a shared asset while another actor uses it. Repeat load/restart cycles; memory and listener counts should stabilize. See the game-playtest skill for a performance investigation when measurement is the task.
