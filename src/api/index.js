import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (future use)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const scanApi = {
  scanUrl: (url) => api.post('/scan', { url }),
};

export const linksApi = {
  create: (data) => api.post('/links', data),
  getAll: () => api.get('/links'),
  getBySlug: (slug) => api.get(`/links/${slug}`),
  checkSlug: (slug) => api.get(`/links/check-slug/${slug}`),
  update: (slug, data) => api.put(`/links/${slug}`, data),
  delete: (slug) => api.delete(`/links/${slug}`),
};

export const analyticsApi = {
  getStats: (slug) => api.get(`/analytics/${slug}`),
};

export default api;