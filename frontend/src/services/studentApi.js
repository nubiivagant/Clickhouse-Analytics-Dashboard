import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/students',
  timeout: 10000,
});

export const addStudent = (student) => api.post('/', student).then((r) => r.data);

export default {
  addStudent,
};
