import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
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

export const login = (email, password) =>
  api.post('/auth/login', { email, password });
export const register = (username, email, password) =>
  api.post('/auth/register', { username, email, password });

export const getProfile = () => api.get('/auth/profile');
export const getAllUsers = () => api.get('/users');

export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status });
export const updateTaskPriority = (id, priority) =>
  api.patch(`/tasks/${id}/priority`, { priority });

export default api;
