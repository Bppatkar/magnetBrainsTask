import { createContext, useContext, useState } from 'react';
import api from '../api/api.js';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    setError(null);
    try {
      const res = await api.post('/tasks', taskData);
      setTasks((prevTasks) => [...prevTasks, res.data]);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add tasks');
      throw error;
    }
  };

  const updateTask = async (taskId, taskData) => {
    setError(null);
    try {
      const res = await api.put(`/tasks${taskId}`, taskData);
      setTasks((prevTasks) =>
        prevTasks.tasks.map((task) => (task._id === taskId ? res.data : task))
      );
    } catch (error) {
      setError(error.response?.data?.message || 'failed to update tasks');
      throw error;
    }
  };
  const deleteTask = async (taskId) => {
    setError(null);
    try {
      await api.delete(`/tasks${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      setError(error.response?.data?.message || 'failed to delete tasks');
      throw error;
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

export const useTasks = () => useContext(TaskContext);
