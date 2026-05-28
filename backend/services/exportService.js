const { createObjectCsvStringifier } = require('csv-writer');
const PDFDocument = require('pdfkit');
const analyticsService = require('./analyticsService');
const insightService = require('./insightService');

const formatTimestamp = () => new Date().toLocaleString();

const generateSectionCsv = (title, header, records) => {
  let csv = `${title}\n`;
  if (!records || records.length === 0) {
    return `${csv}No data available\n\n`;
  }

  const csvStringifier = createObjectCsvStringifier({ header });
  csv += csvStringifier.getHeaderString();
  csv += csvStringifier.stringifyRecords(records);
  csv += '\n';
  return csv;
};

const collectAnalyticsData = async (filters = {}) => {
  const [overview, gender, race, lunch, testPrep, parentEducation, topPerformers, insights] =
    await Promise.all([
      analyticsService.getOverview(filters),
      analyticsService.getGenderAnalysis(filters),
      analyticsService.getRaceAnalysis(filters),
      analyticsService.getLunchAnalysis(filters),
      analyticsService.getTestPrepAnalysis(filters),
      analyticsService.getParentEducationAnalysis(filters),
      analyticsService.getTopPerformers(filters),
      insightService.generateInsights(filters),
    ]);

  return {
    overview,
    gender,
    race,
    lunch,
    testPrep,
    parentEducation,
    topPerformers,
    insights,
  };
};

const generateCSVReport = async (filters = {}) => {
  const data = await collectAnalyticsData(filters);

  let csv = '';
  csv += `Student Analytics Report\nGenerated: ${formatTimestamp()}\n\n`;

  csv += generateSectionCsv(
    'Dashboard Overview',
    [
      { id: 'total_students', title: 'Total Students' },
      { id: 'avg_math_score', title: 'Avg Math Score' },
      { id: 'avg_reading_score', title: 'Avg Reading Score' },
      { id: 'avg_writing_score', title: 'Avg Writing Score' },
      { id: 'completed_test_prep', title: 'Completed Test Prep' },
    ],
    [data.overview]
  );

  csv += generateSectionCsv(
    'Gender Analysis',
    [
      { id: 'gender', title: 'Gender' },
      { id: 'avg_math', title: 'Avg Math' },
      { id: 'avg_reading', title: 'Avg Reading' },
      { id: 'avg_writing', title: 'Avg Writing' },
    ],
    data.gender
  );

  csv += generateSectionCsv(
    'Race Analysis',
    [
      { id: 'ethnicity', title: 'Ethnicity' },
      { id: 'avg_math_score', title: 'Avg Math' },
      { id: 'avg_reading_score', title: 'Avg Reading' },
      { id: 'avg_writing_score', title: 'Avg Writing' },
      { id: 'total_students', title: 'Total Students' },
    ],
    data.race
  );

  csv += generateSectionCsv(
    'Lunch Analysis',
    [
      { id: 'lunch', title: 'Lunch Type' },
      { id: 'total_students', title: 'Total Students' },
      { id: 'avg_math_score', title: 'Avg Math' },
      { id: 'avg_reading_score', title: 'Avg Reading' },
      { id: 'avg_writing_score', title: 'Avg Writing' },
      { id: 'overall_average', title: 'Overall Average' },
    ],
    data.lunch
  );

  csv += generateSectionCsv(
    'Test Preparation Analysis',
    [
      { id: 'preparation_course', title: 'Preparation Course' },
      { id: 'total_students', title: 'Total Students' },
      { id: 'avg_math_score', title: 'Avg Math' },
      { id: 'avg_reading_score', title: 'Avg Reading' },
      { id: 'avg_writing_score', title: 'Avg Writing' },
      { id: 'overall_average', title: 'Overall Average' },
    ],
    data.testPrep
  );

  csv += generateSectionCsv(
    'Parent Education Analysis',
    [
      { id: 'parent_education', title: 'Parent Education' },
      { id: 'total_students', title: 'Total Students' },
      { id: 'avg_math_score', title: 'Avg Math' },
      { id: 'avg_reading_score', title: 'Avg Reading' },
      { id: 'avg_writing_score', title: 'Avg Writing' },
      { id: 'overall_average', title: 'Overall Average' },
    ],
    data.parentEducation
  );

  csv += generateSectionCsv(
    'Top Performers',
    [
      { id: 'gender', title: 'Gender' },
      { id: 'ethnicity', title: 'Ethnicity' },
      { id: 'parent_education', title: 'Parent Education' },
      { id: 'preparation_course', title: 'Preparation Course' },
      { id: 'math_score', title: 'Math Score' },
      { id: 'reading_score', title: 'Reading Score' },
      { id: 'writing_score', title: 'Writing Score' },
      { id: 'total_score', title: 'Total Score' },
      { id: 'average_score', title: 'Average Score' },
    ],
    data.topPerformers
  );

  return Buffer.from(csv, 'utf8');
};

const writeTextTable = (doc, title, records, columns) => {
  doc.fontSize(14).fillColor('#333').text(title, { underline: true });
  doc.moveDown(0.3);

  if (!records || records.length === 0) {
    doc.fontSize(10).fillColor('#555').text('No data available.');
    doc.moveDown();
    return;
  }

  records.forEach((record) => {
    const line = columns
      .map((col) => `${col.label}: ${record[col.key] ?? ''}`)
      .join(' | ');
    doc.fontSize(10).fillColor('#000').text(line, { paragraphGap: 2 });
  });

  doc.moveDown();
};

const generatePDFReport = async (filters = {}) => {
  const data = await collectAnalyticsData(filters);
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  const endPromise = new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  doc.fontSize(22).fillColor('#0d3b66').text('Student Analytics Report', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#555').text(`Generated: ${formatTimestamp()}`, { align: 'center' });
  doc.moveDown(1.5);

  doc.fontSize(14).fillColor('#0d3b66').text('Dashboard Summary');
  doc.moveDown(0.3);
  const overview = data.overview || {};
  doc.fontSize(10).fillColor('#000');
  doc.text(`Total Students: ${overview.total_students ?? 'N/A'}`);
  doc.text(`Average Math Score: ${overview.avg_math_score ?? 'N/A'}`);
  doc.text(`Average Reading Score: ${overview.avg_reading_score ?? 'N/A'}`);
  doc.text(`Average Writing Score: ${overview.avg_writing_score ?? 'N/A'}`);
  doc.text(`Completed Test Preparation: ${overview.completed_test_prep ?? 'N/A'}`);
  doc.moveDown();

  writeTextTable(doc, 'Gender Analysis', data.gender, [
    { key: 'gender', label: 'Gender' },
    { key: 'avg_math', label: 'Avg Math' },
    { key: 'avg_reading', label: 'Avg Reading' },
    { key: 'avg_writing', label: 'Avg Writing' },
  ]);

  writeTextTable(doc, 'Race Analysis', data.race, [
    { key: 'ethnicity', label: 'Ethnicity' },
    { key: 'avg_math_score', label: 'Avg Math' },
    { key: 'avg_reading_score', label: 'Avg Reading' },
    { key: 'avg_writing_score', label: 'Avg Writing' },
    { key: 'total_students', label: 'Total Students' },
  ]);

  writeTextTable(doc, 'Lunch Analysis', data.lunch, [
    { key: 'lunch', label: 'Lunch' },
    { key: 'total_students', label: 'Total Students' },
    { key: 'avg_math_score', label: 'Avg Math' },
    { key: 'avg_reading_score', label: 'Avg Reading' },
    { key: 'avg_writing_score', label: 'Avg Writing' },
    { key: 'overall_average', label: 'Overall Avg' },
  ]);

  writeTextTable(doc, 'Test Preparation Analysis', data.testPrep, [
    { key: 'preparation_course', label: 'Preparation Course' },
    { key: 'total_students', label: 'Total Students' },
    { key: 'avg_math_score', label: 'Avg Math' },
    { key: 'avg_reading_score', label: 'Avg Reading' },
    { key: 'avg_writing_score', label: 'Avg Writing' },
    { key: 'overall_average', label: 'Overall Avg' },
  ]);

  writeTextTable(doc, 'Parent Education Analysis', data.parentEducation, [
    { key: 'parent_education', label: 'Parent Education' },
    { key: 'total_students', label: 'Total Students' },
    { key: 'avg_math_score', label: 'Avg Math' },
    { key: 'avg_reading_score', label: 'Avg Reading' },
    { key: 'avg_writing_score', label: 'Avg Writing' },
    { key: 'overall_average', label: 'Overall Avg' },
  ]);

  writeTextTable(doc, 'Top Performers', data.topPerformers, [
    { key: 'gender', label: 'Gender' },
    { key: 'ethnicity', label: 'Ethnicity' },
    { key: 'parent_education', label: 'Parent Education' },
    { key: 'preparation_course', label: 'Preparation Course' },
    { key: 'math_score', label: 'Math' },
    { key: 'reading_score', label: 'Reading' },
    { key: 'writing_score', label: 'Writing' },
    { key: 'total_score', label: 'Total Score' },
    { key: 'average_score', label: 'Average Score' },
  ]);

  doc.addPage();
  doc.fontSize(14).fillColor('#0d3b66').text('Key Insights');
  doc.moveDown(0.3);

  if (data.insights && data.insights.length > 0) {
    data.insights.forEach((insight, index) => {
      doc.fontSize(10).fillColor('#000').text(`${index + 1}. ${insight}`, { paragraphGap: 4 });
    });
  } else {
    doc.fontSize(10).fillColor('#555').text('No insights available.');
  }

  doc.end();
  return endPromise;
};

module.exports = {
  generateCSVReport,
  generatePDFReport,
};
