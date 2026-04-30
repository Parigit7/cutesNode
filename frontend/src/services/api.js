import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('cutes-user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (err) {
      console.error('Failed to parse stored auth token', err);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Only clear session on actual unauthorized token/session.
    // 403 can happen for permission/business constraints and should not force logout.
    if (status === 401) {
      localStorage.removeItem('cutes-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
