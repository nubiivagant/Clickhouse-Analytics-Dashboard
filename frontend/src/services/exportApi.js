import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 20000,
  responseType: 'blob',
});

const buildParams = (filters = {}) => {
  const params = {};
  if (filters.gender) params.gender = filters.gender;
  if (filters.ethnicity) params.ethnicity = filters.ethnicity;
  if (filters.lunch) params.lunch = filters.lunch;
  if (filters.preparation_course) params.preparation_course = filters.preparation_course;
  if (filters.parent_education) params.parent_education = filters.parent_education;
  return params;
};

export const exportCSV = (filters = {}) =>
  api.get('/export/csv', { params: buildParams(filters) });

export const exportPDF = (filters = {}) =>
  api.get('/export/pdf', { params: buildParams(filters) });

export default {
  exportCSV,
  exportPDF,
};
