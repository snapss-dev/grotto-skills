// Renderer-independent reference. Prefer an engine's existing animator when available.
export function createFrameClock({ frames, fps = 8, loop = true }) {
  if (!Number.isInteger(frames) || frames < 1 || !Number.isFinite(fps) || fps <= 0) {
    throw new RangeError('frames must be positive integral and fps positive finite');
  }
  let elapsed = 0;
  let completed = false;
  return {
    reset() { elapsed = 0; completed = false; },
    advance(dt) {
      if (!Number.isFinite(dt) || dt < 0) throw new RangeError('dt must be non-negative seconds');
      elapsed += dt;
      const index = Math.floor(elapsed * fps + 1e-9);
      const finished = !loop && index >= frames;
      const justFinished = finished && !completed;
      completed = finished;
      return { frame: loop ? index % frames : Math.min(index, frames - 1), finished, justFinished };
    },
  };
}
