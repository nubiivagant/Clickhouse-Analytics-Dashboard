const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverview);
router.get('/gender-analysis', analyticsController.genderAnalysis);
router.get('/race-analysis', analyticsController.getRaceAnalysis);
router.get('/test-prep-analysis', analyticsController.getTestPrepAnalysis);
router.get('/parent-education-analysis', analyticsController.getParentEducationAnalysis);
router.get('/top-performers', analyticsController.getTopPerformers);
router.get('/score-distribution', analyticsController.getScoreDistribution);
router.get('/lunch-analysis', analyticsController.getLunchAnalysis);
router.get('/query-performance', analyticsController.getQueryPerformance);
router.get('/insights', analyticsController.getInsights);

module.exports = router;
