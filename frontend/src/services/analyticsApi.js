import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/analytics',
  timeout: 10000,
});

// Helper to build params from filters, excluding undefined/null values
const buildParams = (filters = {}) => {
  const params = {};
  if (filters.gender) params.gender = filters.gender;
  if (filters.ethnicity) params.ethnicity = filters.ethnicity;
  if (filters.lunch) params.lunch = filters.lunch;
  if (filters.preparation_course) params.preparation_course = filters.preparation_course;
  if (filters.parent_education) params.parent_education = filters.parent_education;
  return params;
};

export const getOverview = (filters = {}) => 
  api.get('/overview', { params: buildParams(filters) }).then(r => r.data);

export const getGenderAnalysis = (filters = {}) => 
  api.get('/gender-analysis', { params: buildParams(filters) }).then(r => r.data);

export const getRaceAnalysis = (filters = {}) => 
  api.get('/race-analysis', { params: buildParams(filters) }).then(r => r.data);

export const getLunchAnalysis = (filters = {}) => 
  api.get('/lunch-analysis', { params: buildParams(filters) }).then(r => r.data);

export const getTestPrepAnalysis = (filters = {}) => 
  api.get('/test-prep-analysis', { params: buildParams(filters) }).then(r => r.data);

export const getParentEducationAnalysis = (filters = {}) => 
  api.get('/parent-education-analysis', { params: buildParams(filters) }).then(r => r.data);

export const getTopPerformers = (filters = {}) => 
  api.get('/top-performers', { params: buildParams(filters) }).then(r => r.data);

export const getScoreDistribution = (filters = {}) => 
  api.get('/score-distribution', { params: buildParams(filters) }).then(r => r.data);

export const getInsights = (filters = {}) => 
  api.get('/insights', { params: buildParams(filters) }).then(r => r.data);

export default {
  getOverview,
  getGenderAnalysis,
  getRaceAnalysis,
  getLunchAnalysis,
  getTestPrepAnalysis,
  getParentEducationAnalysis,
  getTopPerformers,
  getScoreDistribution,
  getInsights,
};
