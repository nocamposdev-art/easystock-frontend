import axios from 'axios';

// Usa la variable de entorno o un valor por defecto para local
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:58835/api',
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