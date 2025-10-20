import { beforeEach, describe, expect, test, vi } from 'vitest'
import Scheduler from '../src/scheduler.js';

describe('execute functionality', () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new Scheduler();
  });

  test('executes the stored functions', async () => {
    const mockFn = vi.fn((a, b) => a + b);
    scheduler.add(mockFn, 1, 3);
    expect(mockFn).not.toHaveBeenCalled();
    await scheduler.execute();
    expect(mockFn).toHaveBeenCalledTimes(1);
  })

  test('executes the stored functions with the correct arguments', async () => {
    const mockFn = vi.fn((a, b) => a + b);
    scheduler.add(mockFn, 1, 3);
    expect(mockFn).not.toHaveBeenCalled();
    await scheduler.execute();
    expect(mockFn).toHaveBeenCalledWith(1, 3);
  })

  test('verifies the result of each executed function is correct', async () => {
    const mockFn = vi.fn((a, b) => a + b);
    scheduler.add(mockFn, 1, 3);
    const results = await scheduler.execute();
    expect(results).toEqual([4]);
  })

  test('executes functions with arbitrary number of parameters', async () => {
    const mockFn = vi.fn((...nums) => nums.reduce((a, b) => a + b, 0));
    scheduler.add(mockFn, 1, 2, 3, 4);
    const results = await scheduler.execute();
    expect(results).toEqual([10]);
  });

  test('executes asynchronous functions and handles errors', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const errorFn = vi.fn().mockRejectedValue('failure');

    scheduler.add(asyncFn);
    scheduler.add(errorFn);

    const results = await scheduler.execute();

    expect(results).toEqual(['success', 'failure']);
  });

  test('clear queue after processing', async () => {
    const mockFn = vi.fn(() => { });
    scheduler.add(mockFn);
    expect(scheduler._queue.length).toStrictEqual(1)
    await scheduler.execute();
    expect(scheduler._queue.length).toStrictEqual(0)
  });
});
