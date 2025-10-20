import { beforeEach, describe, expect, test } from 'vitest'
import Scheduler from '../src/scheduler.js';

describe('queue functionality', () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new Scheduler();
  });

  test('stores a single function', () => {
    const mockFn = () => 1;
    expect(scheduler._queue.length).toEqual(0);
    scheduler.add(mockFn);
    expect(scheduler._queue.length).toEqual(1);
    expect(scheduler._queue.at(-1).fn).toBe(mockFn)
  });

  test('stores multiple functions', () => {
    const mockFn = () => 1;
    const mockFn2 = () => 2;

    expect(scheduler._queue.length).toEqual(0);
    scheduler.add(mockFn);
    expect(scheduler._queue.length).toEqual(1);
    expect(scheduler._queue.at(-1).fn).toBe(mockFn)
    scheduler.add(mockFn2);
    expect(scheduler._queue.length).toEqual(2);
    expect(scheduler._queue.at(-1).fn).toBe(mockFn2)
  });
});
