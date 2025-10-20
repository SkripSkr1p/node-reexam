import { beforeEach, describe, expect, test, vi } from 'vitest'
import Scheduler from '../src/scheduler.js';

describe('stats functionality', () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new Scheduler();
  });

  test('initial stats', () => {
    expect(scheduler.stats).toEqual({
      fulfilled: 0,
      waiting: 0,
      rejected: 0
    });
  })

  test('count fulfilled functions', async () => {
    expect(scheduler.stats.fulfilled).toEqual(0)
    const mockFn = vi.fn().mockResolvedValue();
    scheduler.add(mockFn);
    await scheduler.execute()
    expect(scheduler.stats.fulfilled).toEqual(1)
  });

  test('count waiting functions', async () => {
    expect(scheduler.stats.waiting).toEqual(0)
    const mockFn = vi.fn().mockResolvedValue();
    scheduler.add(mockFn);
    expect(scheduler.stats.waiting).toEqual(1)
    await scheduler.execute()
    expect(scheduler.stats.waiting).toEqual(0)
  });

  test('count rejected functions', async () => {
    expect(scheduler.stats.rejected).toEqual(0)
    const mockFn = vi.fn().mockRejectedValue();
    scheduler.add(mockFn);
    await scheduler.execute()
    expect(scheduler.stats.rejected).toEqual(1)
  });
});
