export default class Scheduler {
  _cache = new Map();
  _queue = [];
  _stats = {
    fulfilled: 0,
    rejected: 0,
    waiting: 0
  };

  _getFromCache(task) {
    // Ищем в кеше по структуре объекта
    for (const [cachedTask, result] of this._cache.entries()) {
      if (cachedTask.fn === task.fn && 
          JSON.stringify(cachedTask.args) === JSON.stringify(task.args)) {
        return result;
      }
    }
    throw new Error('Cache miss');
  }
  _writeToCache(task, result) {
    this._cache.set(task, result);
  }

  add(fn, ...args) {
    this._queue.push({ fn, args });
    this._stats.waiting++;
  }
  async execute() {
    const results = [];
    
    for (const task of this._queue) {
      try {
        // Проверяем кеш
        const cachedResult = this._getFromCache(task);
        results.push(cachedResult);
        this._stats.fulfilled++;
      } catch (error) {
        // Если нет в кеше, выполняем функцию
        try {
          const result = await task.fn(...task.args);
          this._writeToCache(task, result);
          results.push(result);
          this._stats.fulfilled++;
        } catch (execError) {
          // Если это отклоненный Promise, получаем его значение
          const errorValue = execError instanceof Error ? execError.message : execError;
          results.push(errorValue);
          this._stats.rejected++;
        }
      }
    }
    
    // Очищаем очередь и обновляем статистику
    this._queue = [];
    this._stats.waiting = 0;
    
    return results;
  }
  get stats() {
    return { ...this._stats };
  }
}
