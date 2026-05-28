const clickhouse = require('../clickhouse');
const performanceService = require('./performanceService');
const { buildFilterClause } = require('./filterBuilder');

const executeQuery = async (query, endpoint = 'unknown', queryParams = {}) => {
  const start = Date.now();
  const resultSet = await clickhouse.query({
    query,
    format: 'JSONEachRow',
    query_params: queryParams,
  });
  const executionTimeMs = Date.now() - start;

  // record performance (do not block caller)
  try {
    performanceService.recordExecution({ endpoint, executionTimeMs, query });
  } catch (e) {
    // swallow tracking errors
    console.error('Performance tracking failed', e.message);
  }

  return resultSet.json();
};

const getOverview = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      COUNT(*) AS total_students,
      ROUND(AVG(\`math score\`), 2) AS avg_math_score,
      ROUND(AVG(\`reading score\`), 2) AS avg_reading_score,
      ROUND(AVG(\`writing score\`), 2) AS avg_writing_score,
      countIf(\`test preparation course\` = 'completed') AS completed_test_prep
    FROM performance
    ${whereClause}
  `;

  const data = await executeQuery(query, 'overview', queryParams);
  return data[0];
};

const getGenderAnalysis = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      gender,
      ROUND(AVG(\`math score\`), 2) AS avg_math,
      ROUND(AVG(\`reading score\`), 2) AS avg_reading,
      ROUND(AVG(\`writing score\`), 2) AS avg_writing
    FROM performance
    ${whereClause}
    GROUP BY gender
    ORDER BY gender
  `;

  return executeQuery(query, 'gender-analysis', queryParams);
};

const getRaceAnalysis = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      \`race/ethnicity\` AS ethnicity,
      ROUND(AVG(\`math score\`), 2) AS avg_math_score,
      ROUND(AVG(\`reading score\`), 2) AS avg_reading_score,
      ROUND(AVG(\`writing score\`), 2) AS avg_writing_score,
      COUNT(*) AS total_students
    FROM performance
    ${whereClause}
    GROUP BY \`race/ethnicity\`
    ORDER BY avg_math_score DESC
  `;

  return executeQuery(query, 'race-analysis', queryParams);
};

const getTestPrepAnalysis = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      \`test preparation course\` AS preparation_course,
      COUNT(*) AS total_students,
      ROUND(AVG(\`math score\`), 2) AS avg_math_score,
      ROUND(AVG(\`reading score\`), 2) AS avg_reading_score,
      ROUND(AVG(\`writing score\`), 2) AS avg_writing_score,
      ROUND(
        AVG(
          (\`math score\` + \`reading score\` + \`writing score\`) / 3
        ),
        2
      ) AS overall_average
    FROM performance
    ${whereClause}
    GROUP BY \`test preparation course\`
    ORDER BY overall_average DESC
  `;

  return executeQuery(query, 'test-prep-analysis', queryParams);
};

const getParentEducationAnalysis = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      \`parental level of education\` AS parent_education,
      COUNT(*) AS total_students,
      ROUND(AVG(\`math score\`), 2) AS avg_math_score,
      ROUND(AVG(\`reading score\`), 2) AS avg_reading_score,
      ROUND(AVG(\`writing score\`), 2) AS avg_writing_score,
      ROUND(
        AVG(
          (\`math score\` + \`reading score\` + \`writing score\`) / 3
        ),
        2
      ) AS overall_average
    FROM performance
    ${whereClause}
    GROUP BY \`parental level of education\`
    ORDER BY overall_average DESC
  `;

  return executeQuery(query, 'parent-education-analysis', queryParams);
};

const getTopPerformers = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      gender,
      \`race/ethnicity\` AS ethnicity,
      \`parental level of education\` AS parent_education,
      \`test preparation course\` AS preparation_course,
      \`math score\` AS math_score,
      \`reading score\` AS reading_score,
      \`writing score\` AS writing_score,
      (
        \`math score\`
        + \`reading score\`
        + \`writing score\`
      ) AS total_score,
      ROUND(
        (
          \`math score\`
          + \`reading score\`
          + \`writing score\`
        ) / 3.0,
        2
      ) AS average_score
    FROM performance
    ${whereClause}
    ORDER BY total_score DESC
    LIMIT 10
  `;

  return executeQuery(query, 'top-performers', queryParams);
};

const getScoreDistribution = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      score_range,
      COUNT(*) AS student_count
    FROM
    (
      SELECT
        multiIf(
          avg_score >= 90, '90-100',
          avg_score >= 80, '80-89',
          avg_score >= 70, '70-79',
          avg_score >= 60, '60-69',
          avg_score >= 50, '50-59',
          avg_score >= 40, '40-49',
          'Below 40'
        ) AS score_range
      FROM
      (
        SELECT
          (
            \`math score\`
            + \`reading score\`
            + \`writing score\`
          ) / 3.0 AS avg_score
        FROM performance
        ${whereClause}
      )
    )
    GROUP BY score_range
    ORDER BY score_range
  `;

  return executeQuery(query, 'score-distribution', queryParams);
};

const getLunchAnalysis = async (filters = {}) => {
  const { whereClause, queryParams } = buildFilterClause(filters);
  const query = `
    SELECT
      lunch,
      COUNT(*) AS total_students,
      ROUND(AVG(\`math score\`), 2) AS avg_math_score,
      ROUND(AVG(\`reading score\`), 2) AS avg_reading_score,
      ROUND(AVG(\`writing score\`), 2) AS avg_writing_score,
      ROUND(
        AVG(
          (\`math score\` + \`reading score\` + \`writing score\`) / 3
        ),
        2
      ) AS overall_average
    FROM performance
    ${whereClause}
    GROUP BY lunch
    ORDER BY overall_average DESC
  `;

  return executeQuery(query, 'lunch-analysis', queryParams);
};

module.exports = {
  getOverview,
  getGenderAnalysis,
  getRaceAnalysis,
  getTestPrepAnalysis,
  getParentEducationAnalysis,
  getTopPerformers,
  getScoreDistribution,
  getLunchAnalysis,
};