# A readable, maintainable spatial game

Fresh Studio spatial projects have a revision-owned Three.js/Grotto3D foundation. Preserve platform helpers, declarations and compiled output. Keep authored world/rules in src/**/*.ts and run check_project after meaningful edits. For an API absent from the installed structural types, author a precise interface and narrow unknown; do not weaken the protected types.

## Start from the installed loop

~~~ts
window.Grotto3D.boot(async ({ THREE, kit }) => {
  const app = kit.createApp(THREE, { mode: "3d", camera: "perspective" });
  app.addUpdate((fixedDt) => {
    // Advance plain simulation state in seconds, then synchronize the scene.
  });
  return app;
});
~~~

Use the creator's existing 2.5D or 3D mode. Separate the player/controller root, visual model and camera rig. Normalize diagonal movement. Keep look sensitivity independent of frame rate and suspend look/movement behind overlays. Do not add another requestAnimationFrame loop or fixed-step accumulator around the kit.

## Readability before decoration

Establish scale, a ground plane, player silhouette, objective, camera bounds and collision first. Select lighting for the art direction: a HemisphereLight and DirectionalLight are a useful outdoor starting point, not a required rig. Unlit/stylized materials may be the right choice. Check shadows, background contrast and occlusion from the actual gameplay camera. A screenshot from a free camera is not evidence that the player can navigate.

Load generated textures from the returned asset registry. Use TextureLoader only with real available sources; show a fallback while loading. Keep color/data texture interpretation appropriate to the material. Use nearest filtering for pixel art; when generateMipmaps is false, use a non-mipmap minFilter such as NearestFilter.

## Physics and ownership

Use Grotto3D.loadRapier when rigid bodies or reliable collision response are needed. Keep collision shapes simpler than rendered meshes. Move dynamic bodies through the physics API; synchronize the visual object afterward. Avoid teleporting the mesh independently of its body. Test slope edges, high-speed contacts, respawn inside geometry and paused/resumed simulation.

For a small bounded arcade world, the existing simple collision helper may suffice. Introduce a physics engine for a concrete need, not solely because the scene is 3D.

## Measured rendering cost

Measure frame time on the target viewport and device class. Watch renderer.info render calls, triangles and memory counts as diagnostics, not universal quotas. For repeated props share geometry/materials and use InstancedMesh when individual object behavior permits it. Reduce excessive shadow casters, postprocessing or pixel ratio after isolating the bottleneck.

Dispose owned geometry, textures, materials, listeners and model mixers on removal or scene teardown. Do not dispose a shared asset while another actor uses it. Repeat load/restart cycles; memory and listener counts should stabilize. See the game-playtest skill for a performance investigation when measurement is the task.
