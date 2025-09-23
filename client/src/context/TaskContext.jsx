import { createContext, useContext, useState, useEffect } from 'react';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskPriority,
  updateTaskStatus,
} from '../api/api.js';
import { useAuth } from './AuthContext.jsx';

const TaskContext = createContext();

export const useTasks = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const { data } = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Fetch tasks error:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const { data } = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const { data } = await updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? data : task))
      );
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      const { data } = await updateTaskStatus(id, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? data : task))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleUpdateTaskPriority = async (id, priority) => {
    try {
      const { data } = await updateTaskPriority(id, priority);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? data : task))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update task priority.'
      );
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [currentUser]);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleUpdateTaskStatus,
    handleUpdateTaskPriority,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
