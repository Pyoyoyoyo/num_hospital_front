import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // API Gateway URL

// Axios instance үүсгэх
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Хүсэлт бүрд токен дамжуулах interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Хариулт хүлээн авах interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 алдаа гарвал token устгаж, нэвтрэх хуудас руу чиглүүлэх
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 