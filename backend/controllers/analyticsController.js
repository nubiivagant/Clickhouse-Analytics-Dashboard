const analyticsService = require('../services/analyticsService');
const performanceService = require('../services/performanceService');
const insightService = require('../services/insightService');

const extractFilters = (query) => {
  return {
    gender: query.gender,
    ethnicity: query.ethnicity,
    lunch: query.lunch,
    preparation_course: query.preparation_course,
    parent_education: query.parent_education,
  };
};

const sendResponse = (res, data) => {
  res.status(200).json({
    success: true,
    data,
  });
};

const getOverview = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getOverview(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const genderAnalysis = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getGenderAnalysis(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getRaceAnalysis = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getRaceAnalysis(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getTestPrepAnalysis = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getTestPrepAnalysis(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getParentEducationAnalysis = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getParentEducationAnalysis(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getTopPerformers = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getTopPerformers(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getScoreDistribution = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getScoreDistribution(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getLunchAnalysis = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const data = await analyticsService.getLunchAnalysis(filters);
    sendResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getQueryPerformance = async (req, res, next) => {
  try {
    const metrics = performanceService.getMetrics(10);
    sendResponse(res, metrics);
  } catch (error) {
    next(error);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const insights = await insightService.generateInsights(filters);
    sendResponse(res, { insights });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  genderAnalysis,
  getRaceAnalysis,
  getTestPrepAnalysis,
  getParentEducationAnalysis,
  getTopPerformers,
  getScoreDistribution,
  getLunchAnalysis,
  getQueryPerformance,
  getInsights,
};
