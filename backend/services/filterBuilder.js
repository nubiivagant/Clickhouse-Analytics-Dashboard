/**
 * Build dynamic WHERE clause from filter parameters
 * Prevents SQL injection by returning safe backtick-quoted identifiers
 */

const buildFilterClause = (filters = {}) => {
  const conditions = [];
  const queryParams = {};
  const validFilters = {
    gender: { column: 'gender', type: 'String' },
    ethnicity: { column: '`race/ethnicity`', type: 'String' },
    lunch: { column: 'lunch', type: 'String' },
    preparation_course: { column: '`test preparation course`', type: 'String' },
    parent_education: { column: '`parental level of education`', type: 'String' },
  };

  for (const [key, value] of Object.entries(filters)) {
    if (!value || !validFilters[key]) continue;
    const { column, type } = validFilters[key];
    conditions.push(`${column} = {${key}: ${type}}`);
    queryParams[key] = value;
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    queryParams,
    isEmpty: conditions.length === 0,
  };
};

module.exports = {
  buildFilterClause,
};
