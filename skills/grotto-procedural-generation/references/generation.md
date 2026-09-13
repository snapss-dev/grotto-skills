# Procedural content generation for Grotto games

Seeded code beats hand-authored repetition: infinite levels, daily challenges,
roguelike replayability — all free. Rules that keep it FUN and SAFE:

## 0. Always seed the RNG
```js
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(seed); // rng() in [0,1) — reproducible, shareable
```
Never mix Math.random() into seeded generation. Surface the seed (URL/HUD) so a
level can be replayed or shared; derive a daily seed from the date for daily runs.

## 1. Caves — cellular automata
```js
function caves(w, h, rng, fill = 0.45, passes = 5) {
  let g = Array.from({ length: h }, () => Array.from({ length: w }, () => (rng() < fill ? 1 : 0)));
  for (let p = 0; p < passes; p++) {
    const next = g.map((row) => row.slice());
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let walls = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const ny = y + dy, nx = x + dx;
        walls += ny < 0 || nx < 0 || ny >= h || nx >= w ? 1 : g[ny][nx];
      }
      next[y][x] = walls >= 5 ? 1 : 0;
    }
    g = next;
  }
  return g; // 1 = wall, 0 = open
}
```
Then flood-fill open regions, keep the largest, and either fill the rest or carve
corridors to connect them — disconnected caves read as bugs.

## 2. Rooms + corridors (dungeons)
Place N random non-overlapping rects (reject overlaps), then connect successive room
centers with L-shaped corridors (horizontal then vertical). Doors where corridors
meet walls. Simple, reliable, always connected.

## 3. Winding tunnels — drunkard's walk with momentum
From a start cell, repeatedly carve the current cell and step in a direction that
only changes with probability ~0.3 (momentum makes tunnels, not noise). Stop after
carving ~35% of the grid.

## 4. Mazes — recursive backtracker
Stack-based DFS over a cell grid, knocking down walls to unvisited neighbors.
Long winding corridors, always solvable.

## 5. Platformers / endless runners — CHUNK STITCHING (not pure random)
Author 8-15 small hand-made chunks (arrays of columns: ground height, gap, spikes,
coins) tagged easy/medium/hard. Generation = pick chunks by current difficulty and
append. NEVER emit a gap wider than the player's tested max jump — validate against
physics constants, not vibes. Ramp difficulty by distance: weight harder chunks in
as score grows, and cap the ramp at a tested ceiling.

## 6. Loot / encounters
Weighted tables with pity timers (guarantee a reward at least every N chests) beat
raw uniform rolls. Roll from the seeded rng so runs are fair to compare.

## 7. VALIDATE before play
After generating: check the exit is reachable (BFS/flood fill), required pickups are
reachable, and spawn points are not inside walls. On failure, regenerate with
seed+1 (bounded retries). Generation is cheap; a softlocked player quits.

## 8. Fit the platform
Persist the best seed/score via the Grotto SDK (createAutosave) and submit runs with
submitScore so daily-seed leaderboards work — see grotto-game-runtime-developer-sdk.
