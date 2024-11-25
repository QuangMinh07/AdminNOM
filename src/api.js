import axios from 'axios';
import Cookies from 'js-cookie';

// Tạo instance axios
const api = axios.create({
  // baseURL: 'http://localhost:5000',
  baseURL: 'https://nom-9xxu.onrender.com',
});

// Sử dụng Axios Interceptor để tự động thêm token vào headers
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
