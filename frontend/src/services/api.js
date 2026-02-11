import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const API = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
});

/* Attach token to every request */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Global error handling */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      const loginPath = user?.role === 'vendor' ? '/vendor/login'
        : user?.role === 'user' ? '/user/login'
        : '/admin/login';
      if (!window.location.pathname.includes('/login')) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  }
);

export default API;
