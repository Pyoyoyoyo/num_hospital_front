import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<{ url: string }>('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
