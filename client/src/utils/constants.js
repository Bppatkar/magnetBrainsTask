export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api';

export const TASK_PRIORITIES = {
  low: 'Low',
  medium: 'Medium', 
  high: 'High'
};

export const TASK_STATUS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed'
};