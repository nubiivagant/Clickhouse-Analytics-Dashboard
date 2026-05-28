const exportService = require('../services/exportService');

const extractFilters = (query) => ({
  gender: query.gender,
  ethnicity: query.ethnicity,
  lunch: query.lunch,
  preparation_course: query.preparation_course,
  parent_education: query.parent_education,
});

const exportCSV = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const csvBuffer = await exportService.generateCSVReport(filters);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="student-analytics-report.csv"');
    res.send(csvBuffer);
  } catch (error) {
    next(error);
  }
};

const exportPDF = async (req, res, next) => {
  try {
    const filters = extractFilters(req.query);
    const pdfBuffer = await exportService.generatePDFReport(filters);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="student-analytics-report.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportCSV,
  exportPDF,
};
