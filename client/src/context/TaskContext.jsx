import { createContext, useState, useContext } from 'react';
import api from '../api/api.js';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      setError(message);
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    setError(null);
    try {
      const res = await api.post('/tasks', taskData);
      setTasks((prevTasks) => [res.data, ...prevTasks]);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add task';
      setError(message);
      throw new Error(message);
    }
  };

  const updateTask = async (taskId, taskData) => {
    setError(null);
    try {
      const res = await api.put(`/tasks/${taskId}`, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? res.data : task))
      );
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteTask = async (taskId) => {
    setError(null);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};