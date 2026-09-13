# Models that are easy to place, animate and wire into a game

Choose the representation from the creator's style and the object's job. Reuse provided art when suitable. Procedural geometry works for modular/simple forms; Blender produces full meshes, materials, rigs and animation; generate_model_3d produces a voxel aesthetic. These are different options, not interchangeable quality levels.

## Cloud Blender workflow

Use blender_model only when offered in the current run. It takes name and a complete reproducible Blender Python script in the isolated cloud environment. Start with proportions and silhouette, then materials, topology and named actions. Keep the asset within the tool's reported export limits. Use supported glTF materials; bake procedural texture detail when needed. Do not assume arbitrary external resources or compression decoders are packaged.

Read the existing assets/<name>.blender.json recipe before updating a model. Revise through blender_model so the recipe, GLB and preview stay together. Inspect every returned view at useful scale. For animation, inspect more than a rest pose: check the motion's extremes, foot contact and body intersections. A valid export alone does not establish an attractive or usable asset.

## Insert without blocking play

Use the returned scriptTag and exact key, not a guessed filename. It must load before the compiled game script. A current kit exposes:

~~~ts
const model = await kit.loadModel(modelKey);
app.scene.add(model.scene);
const clip = model.animations.find(name => name.toLowerCase().includes("idle"));
if (clip) model.play(clip);
app.addUpdate(dt => model.update(dt));
~~~

Run this as a background load after creating the app. Keep a visible placeholder, handle failure, and discard/dispose a late result if its scene was removed. The example's update callback must be removed or disabled when disposing the model. Inspect installed declarations for lifecycle helpers and play options; do not overwrite a historical protected kit to acquire a new API.

## Placement and gameplay

Blender Z-up becomes game Y-up; retain authored scale/pivots and verify a known dimension. Use a controller root for world position/yaw, and a child visual root for scale, authored axis correction and foot offset. Give the actor a stable ground contact point and collider derived from gameplay needs. Keep decorative motion from moving the physics body unintentionally.

Connect clip changes to state transitions (idle, moving, attack, hit, defeated), not every frame. Do not assume clip names, restart the same action each tick, or let root motion and a velocity controller both translate the actor. Choose an explicit policy for root motion. If a clip is absent, use a compatible fallback; do not claim a rigged animation exists because the object rotates.

The voxel tool exposes window.__grottoModels[key].build(THREE); animate that returned group procedurally. It is not an animated GLB.

## Acceptance

Place the model in the real scene and check silhouette, grounding, facing, scale, lighting, collision, motion transitions and camera framing. Verify two separately controlled instances, loading failure, removal during loading and restart. Use generated assets only after the tool returns and the asset is actually registered.
