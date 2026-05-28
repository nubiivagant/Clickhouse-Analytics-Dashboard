const MAX_ENTRIES = 100;

const executions = [];

const recordExecution = ({ endpoint = 'unknown', executionTimeMs = 0, query = '' } = {}) => {
  const entry = {
    endpoint,
    executionTimeMs: Number(executionTimeMs),
    timestamp: new Date().toISOString(),
    query,
  };

  executions.push(entry);
  if (executions.length > MAX_ENTRIES) executions.shift();
};

const getMetrics = (recentLimit = 10) => {
  const totalQueries = executions.length;
  if (totalQueries === 0) {
    return {
      totalQueries: 0,
      averageExecutionTime: 0,
      fastestQuery: 0,
      slowestQuery: 0,
      recentQueries: [],
    };
  }

  const times = executions.map(e => e.executionTimeMs);
  const sum = times.reduce((s, v) => s + v, 0);
  const avg = Math.round((sum / times.length) * 100) / 100;
  const fastest = Math.min(...times);
  const slowest = Math.max(...times);

  const recentQueries = executions.slice(-recentLimit).map(e => ({
    endpoint: e.endpoint,
    executionTimeMs: e.executionTimeMs,
    timestamp: e.timestamp,
    query: e.query,
  })).reverse(); // most recent first

  return {
    totalQueries,
    averageExecutionTime: avg,
    fastestQuery: fastest,
    slowestQuery: slowest,
    recentQueries,
  };
};

module.exports = {
  recordExecution,
  getMetrics,
};
