import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Adjust key name if needed
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized: redirect to login
        window.location.href = '/login';
      } else if (error.response.status >= 500) {
        // Server errors
        console.error('Server error, please try again later.');
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('Request timed out, please try again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
