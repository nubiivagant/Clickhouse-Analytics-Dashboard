const studentService = require('../services/studentService');

const addStudent = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await studentService.addStudent(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addStudent,
};
