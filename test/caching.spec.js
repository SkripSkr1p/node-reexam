import { beforeEach, describe, expect, test, vi } from 'vitest'
import Scheduler from '../src/scheduler.js';

describe('caching functionality', () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new Scheduler();
  });

  test('read existing values from cache', () => {
    const mockFn = (value1, value2) => value1 + value2
    const mockObject = { fn: mockFn, args: [1, 2] }
    scheduler._cache.set(mockObject, 3)
    expect(scheduler._getFromCache(mockObject)).toStrictEqual(3)
  });

  test('throw error on cache miss', () => {
    const mockFn = vi.fn((value1, value2) => value1 + value2);
    const mockObject = { fn: mockFn, args: [1, 2] }
    expect(() => scheduler._getFromCache(mockObject)).toThrowError('Cache miss')
  });

  test('prefer cache over re-evaluating', async () => {
    const mockFn = vi.fn((value1, value2) => value1 + value2)
    const mockArgs = [1, 2]
    const mockObject = { fn: mockFn, args: mockArgs }
    const spy = vi.spyOn(scheduler, '_getFromCache')

    scheduler._cache.set(mockObject, 3)
    scheduler.add(mockFn, ...mockArgs)

    const results = await scheduler.execute()
    expect(results).toEqual([3])
    expect(spy).toHaveReturnedWith(3)
    expect(mockFn).not.toBeCalled()
  });
});
