const {
  getGenderAnalysis,
  getRaceAnalysis,
  getLunchAnalysis,
  getTestPrepAnalysis,
  getParentEducationAnalysis,
} = require('./analyticsService');

/**
 * Compare two values and generate insight message
 * @param {string} group1Name - Name of first group
 * @param {number} group1Value - Value for first group
 * @param {string} group2Name - Name of second group
 * @param {number} group2Value - Value for second group
 * @param {string} metric - Metric being compared (e.g., "reading score")
 * @returns {string} Insight message
 */
const generateComparisonInsight = (group1Name, group1Value, group2Name, group2Value, metric) => {
  const diff = Math.abs(group1Value - group2Value).toFixed(1);
  const winner = group1Value > group2Value ? group1Name : group2Name;
  const loser = group1Value > group2Value ? group2Name : group1Name;
  return `${winner} students outperform ${loser} students in ${metric} by ${diff} points.`;
};

/**
 * Find highest performer in a group and generate insight
 * @param {Array} data - Array of objects with metric data
 * @param {string} groupField - Field name for group identification
 * @param {string} metricField - Field name for the metric
 * @param {string} metricLabel - Human-readable metric label
 * @returns {string} Insight message
 */
const generateHighestPerformerInsight = (data, groupField, metricField, metricLabel) => {
  if (!data || data.length === 0) return null;
  
  const sorted = [...data].sort((a, b) => b[metricField] - a[metricField]);
  const highest = sorted[0];
  
  if (!highest) return null;
  
  return `${highest[groupField]} records the highest average ${metricLabel}.`;
};

/**
 * Generate insights from gender analysis
 * @param {Array} genderData - Gender analysis data
 * @returns {string|null} Insight message
 */
const generateGenderInsight = (genderData) => {
  if (!genderData || genderData.length < 2) return null;
  
  const femaleData = genderData.find(g => g.gender?.toLowerCase() === 'female');
  const maleData = genderData.find(g => g.gender?.toLowerCase() === 'male');
  
  if (!femaleData || !maleData) return null;
  
  const femaleReading = parseFloat(femaleData.avg_reading || 0);
  const maleReading = parseFloat(maleData.avg_reading || 0);
  
  if (femaleReading !== 0 && maleReading !== 0) {
    return generateComparisonInsight('Female', femaleReading, 'Male', maleReading, 'reading');
  }
  
  return null;
};

/**
 * Generate insights from lunch analysis
 * @param {Array} lunchData - Lunch analysis data
 * @returns {string|null} Insight message
 */
const generateLunchInsight = (lunchData) => {
  if (!lunchData || lunchData.length < 2) return null;
  
  const standardData = lunchData.find(l => l.lunch?.toLowerCase() === 'standard');
  const freeReducedData = lunchData.find(l => l.lunch?.toLowerCase() === 'free/reduced');
  
  if (!standardData || !freeReducedData) return null;
  
  const standardOverall = parseFloat(standardData.overall_average || 0);
  const freeReducedOverall = parseFloat(freeReducedData.overall_average || 0);
  
  if (standardOverall !== 0 && freeReducedOverall !== 0) {
    const diff = Math.abs(standardOverall - freeReducedOverall).toFixed(1);
    const winner = standardOverall > freeReducedOverall ? 'standard' : 'free/reduced';
    return `Students with ${winner} lunch score ${diff} points higher overall.`;
  }
  
  return null;
};

/**
 * Generate insights from test preparation analysis
 * @param {Array} testPrepData - Test preparation analysis data
 * @returns {string|null} Insight message
 */
const generateTestPrepInsight = (testPrepData) => {
  if (!testPrepData || testPrepData.length < 2) return null;
  
  const completedData = testPrepData.find(t => t.preparation_course?.toLowerCase() === 'completed');
  const noneData = testPrepData.find(t => t.preparation_course?.toLowerCase() === 'none');
  
  if (!completedData || !noneData) return null;
  
  const completedOverall = parseFloat(completedData.overall_average || 0);
  const noneOverall = parseFloat(noneData.overall_average || 0);
  
  if (completedOverall !== 0 && noneOverall !== 0) {
    const diff = Math.abs(completedOverall - noneOverall).toFixed(1);
    return `Completing test preparation improves average scores by ${diff} points.`;
  }
  
  return null;
};

/**
 * Generate insights from race/ethnicity analysis
 * @param {Array} raceData - Race analysis data
 * @returns {string|null} Insight message
 */
const generateRaceInsight = (raceData) => {
  if (!raceData || raceData.length === 0) return null;
  
  return generateHighestPerformerInsight(raceData, 'ethnicity', 'avg_math_score', 'academic performance');
};

/**
 * Generate insights from parent education analysis
 * @param {Array} parentEducationData - Parent education analysis data
 * @returns {string|null} Insight message
 */
const generateParentEducationInsight = (parentEducationData) => {
  if (!parentEducationData || parentEducationData.length === 0) return null;
  
  const sorted = [...parentEducationData].sort(
    (a, b) => parseFloat(b.overall_average || 0) - parseFloat(a.overall_average || 0)
  );
  
  const highest = sorted[0];
  if (!highest) return null;
  
  const educationLevel = highest.parent_education || 'Unknown education level';
  return `Students whose parents hold ${educationLevel.toLowerCase()} achieve the strongest overall results.`;
};

/**
 * Generate all insights from analytics data
 * @param {Object} filters - Filter parameters (optional)
 * @returns {Promise<Array>} Array of insight strings
 */
const generateInsights = async (filters = {}) => {
  try {
    // Fetch all analytics data in parallel
    const [genderData, raceData, lunchData, testPrepData, parentEducationData] = await Promise.all([
      getGenderAnalysis(filters),
      getRaceAnalysis(filters),
      getLunchAnalysis(filters),
      getTestPrepAnalysis(filters),
      getParentEducationAnalysis(filters),
    ]);

    const insights = [];

    // Generate gender insight
    const genderInsight = generateGenderInsight(genderData);
    if (genderInsight) insights.push(genderInsight);

    // Generate lunch insight
    const lunchInsight = generateLunchInsight(lunchData);
    if (lunchInsight) insights.push(lunchInsight);

    // Generate test preparation insight
    const testPrepInsight = generateTestPrepInsight(testPrepData);
    if (testPrepInsight) insights.push(testPrepInsight);

    // Generate race/ethnicity insight
    const raceInsight = generateRaceInsight(raceData);
    if (raceInsight) insights.push(raceInsight);

    // Generate parent education insight
    const parentEducationInsight = generateParentEducationInsight(parentEducationData);
    if (parentEducationInsight) insights.push(parentEducationInsight);

    return insights;
  } catch (error) {
    console.error('Error generating insights:', error.message);
    throw error;
  }
};

module.exports = {
  generateInsights,
  generateGenderInsight,
  generateLunchInsight,
  generateTestPrepInsight,
  generateRaceInsight,
  generateParentEducationInsight,
};
