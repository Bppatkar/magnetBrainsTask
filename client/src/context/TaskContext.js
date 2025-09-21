import { createContext, useContext } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {


const [task]


  const value = {};
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => useContext(TaskContext);
