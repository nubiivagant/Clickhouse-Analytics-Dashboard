const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/csv', exportController.exportCSV);
router.get('/pdf', exportController.exportPDF);

module.exports = router;
