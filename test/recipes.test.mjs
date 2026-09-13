import test from 'node:test';
import assert from 'node:assert/strict';
import { createFrameClock } from '../skills/grotto-game-animation/templates/frame-clock.js';
import { generateGrid, reachable, reachableCells } from '../skills/grotto-procedural-generation/templates/seeded-grid.js';

test('animation preserves elapsed time across different render cadences and pause', () => {
  const coarse = createFrameClock({ frames: 7, fps: 11 });
  const fine = createFrameClock({ frames: 7, fps: 11 });
  const expected = coarse.advance(2.4);
  for (let i = 0; i < 144; i++) fine.advance(1 / 60);
  assert.deepEqual(fine.advance(0), expected);
  assert.deepEqual(fine.advance(0), expected);
});

test('one-shot completion happens once, clamps and can restart', () => {
  const clock = createFrameClock({ frames: 4, fps: 8, loop: false });
  assert.deepEqual(clock.advance(0), { frame: 0, finished: false, justFinished: false });
  assert.deepEqual(clock.advance(1), { frame: 3, finished: true, justFinished: true });
  assert.deepEqual(clock.advance(1), { frame: 3, finished: true, justFinished: false });
  clock.reset();
  assert.equal(clock.advance(0).frame, 0);
  assert.equal(clock.advance(0.5).justFinished, true);
  assert.throws(() => clock.advance(-1), RangeError);
  assert.throws(() => createFrameClock({ frames: 0 }), RangeError);
});

test('generated worlds replay and always connect spawn and goal over fixed seeds and sizes', () => {
  for (const [width, height] of [[3, 3], [4, 20], [20, 4], [20, 14], [64, 64]]) {
    for (let seed = 0; seed < 40; seed++) {
      const options = { seed, width, height };
      const world = generateGrid(options);
      assert.deepEqual(generateGrid(options), world);
      assert.ok(reachable(world.grid, world.start, world.goal), JSON.stringify(options));
      assert.equal(reachableCells(world.grid, world.start).size, world.grid.flat().filter(cell => cell === 0).length);
      assert.ok(world.attempts <= 8);
      assert.equal(world.grid.length, height);
      assert.equal(world.grid[0].length, width);
    }
  }
});

test('impossible candidates terminate with a playable fallback and reject unbounded inputs', () => {
  const world = generateGrid({ seed: 0xFFFFFFFF, wallChance: 1, maxAttempts: 2 });
  assert.equal(world.attempts, 2);
  assert.equal(world.fallback, true);
  assert.ok(reachable(world.grid, world.start, world.goal));
  for (const options of [{ width: 99999 }, { height: 0 }, { seed: -1 }, { wallChance: NaN }, { maxAttempts: Infinity }]) {
    assert.throws(() => generateGrid({ seed: 1, ...options }), RangeError);
  }
});
