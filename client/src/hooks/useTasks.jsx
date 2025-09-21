import { useContext } from 'react';
import TaskContext from '../context/TaskContext.js';

export const useTasks = () => useContext(TaskContext);
