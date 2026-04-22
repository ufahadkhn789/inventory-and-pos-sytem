import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const message = error.response.data.message || 'Something went wrong';
      toast.error(message);
    } else {
      toast.error('Network error. Is the backend running?');
    }
    return Promise.reject(error);
  }
);

export default api;
