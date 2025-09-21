import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api.js';
import { useAuth } from './AuthContext.jsx';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [usersFetched, setUsersFetched] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractUsersFromTasks = () => {
    const uniqueUsers = {};
    tasks.forEach(task => {
      if (task.createdBy && task.createdBy._id) {
        uniqueUsers[task.createdBy._id] = task.createdBy;
      }
      if (task.assignedTo && task.assignedTo._id) {
        uniqueUsers[task.assignedTo._id] = task.assignedTo;
      }
    });
    
    // Add current user if not in the list
    if (user && !uniqueUsers[user._id]) {
      uniqueUsers[user._id] = user;
    }
    
    setUsers(Object.values(uniqueUsers));
  };

  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      setTasks(prev => prev.map(task => 
        task._id === id ? { ...task, ...res.data } : task
      ));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Extract users from tasks after they are loaded
  useEffect(() => {
    if (tasks.length > 0 && !usersFetched) {
      extractUsersFromTasks();
      setUsersFetched(true);
    }
  }, [tasks, usersFetched]);

  const value = {
    tasks,
    users,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};