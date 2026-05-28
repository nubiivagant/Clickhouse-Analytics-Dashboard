const clickhouse = require('../clickhouse');

const validateStudentData = (student) => {
  const requiredFields = [
    'gender',
    'race_ethnicity',
    'parental_level_of_education',
    'lunch',
    'test_preparation_course',
    'math_score',
    'reading_score',
    'writing_score',
  ];

  const missingFields = requiredFields.filter((field) => {
    return student[field] === undefined || student[field] === null || student[field] === '';
  });

  if (missingFields.length > 0) {
    const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const scores = ['math_score', 'reading_score', 'writing_score'];
  scores.forEach((scoreField) => {
    const value = Number(student[scoreField]);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      const error = new Error(`${scoreField} must be a number between 0 and 100`);
      error.statusCode = 400;
      throw error;
    }
  });
};

const addStudent = async (student) => {
  validateStudentData(student);

  const payload = {
    gender: student.gender,
    'race/ethnicity': student.race_ethnicity,
    'parental level of education': student.parental_level_of_education,
    lunch: student.lunch,
    'test preparation course': student.test_preparation_course,
    'math score': Number(student.math_score),
    'reading score': Number(student.reading_score),
    'writing score': Number(student.writing_score),
  };

  await clickhouse.insert({
    table: 'performance',
    values: [payload],
    format: 'JSONEachRow',
  });

  return { success: true, message: 'Student added successfully' };
};

module.exports = {
  addStudent,
};
