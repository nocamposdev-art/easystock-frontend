import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:58835/api', // URL base de tu backend
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;