import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Ensure baseURL has protocol
const normalizedBaseURL = baseURL.startsWith('http') ? baseURL : `http://${baseURL}`;

export const axiosInstance = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use((config) => {
  // Log request URL for debugging
  console.log('Request URL:', `${config.baseURL}${config.url}`);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
