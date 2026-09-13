// A top-down four-neighbor example. It does not validate platform jumps or key/lock puzzles.
export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function reachableCells(grid, start) {
  const height = grid.length, width = grid[0]?.length || 0;
  const open = ([x, y]) => x >= 0 && x < width && y >= 0 && y < height && grid[y][x] === 0;
  if (!open(start)) return new Set();
  const queue = [start], seen = new Set([start.join(',')]);
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    for (const next of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const key = next.join(',');
      if (open(next) && !seen.has(key)) { seen.add(key); queue.push(next); }
    }
  }
  return seen;
}

export function reachable(grid, start, goal) {
  return reachableCells(grid, start).has(goal.join(','));
}

export function generateGrid({ seed, width = 20, height = 14, wallChance = 0.3, maxAttempts = 8 }) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF
    || ![width, height].every(n => Number.isInteger(n) && n >= 3 && n <= 128)
    || !Number.isFinite(wallChance) || wallChance < 0 || wallChance > 1
    || !Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 32) {
    throw new RangeError('invalid grid dimensions, uint32 seed, wall chance or attempt bound');
  }
  const start = [1, 1], goal = [width - 2, height - 2];
  let grid;
  const finish = (attempts, fallback) => {
    const connected = reachableCells(grid, start);
    // Keep all advertised floor reachable, so later pickups cannot land on an island.
    grid = grid.map((row, y) => row.map((cell, x) => connected.has(x + ',' + y) ? cell : 1));
    return { generatorVersion: 1, seed, grid, start, goal, attempts, fallback };
  };
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const random = seededRandom((seed + attempt) >>> 0);
    grid = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) =>
      x === 0 || y === 0 || x === width - 1 || y === height - 1 || random() < wallChance ? 1 : 0));
    grid[start[1]][start[0]] = grid[goal[1]][goal[0]] = 0;
    if (reachable(grid, start, goal)) {
      return finish(attempt + 1, false);
    }
  }
  // A reproducible safe corridor after exhausting the configured attempts.
  for (let x = start[0]; x <= goal[0]; x++) grid[start[1]][x] = 0;
  for (let y = start[1]; y <= goal[1]; y++) grid[y][goal[0]] = 0;
  return finish(maxAttempts, true);
}
