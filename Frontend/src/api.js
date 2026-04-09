import axios from 'axios';

// Create base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem('token');
      // Redirect to login page (you might want to use React Router for this)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
