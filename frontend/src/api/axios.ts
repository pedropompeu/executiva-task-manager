import axios from 'axios';

// Define a URL base para todas as requisições da nossa API
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export default api;