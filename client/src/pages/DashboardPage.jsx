import { useState, useEffect } from 'react';
import api from '../api/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks.');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  if (loading) return <div className="text-center mt-8">Loading tasks...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/3">
        <h2 className="text-3xl font-bold mb-4">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <TaskForm 
          onTaskCreated={handleTaskCreated} 
          onTaskUpdated={handleTaskUpdated} 
          taskToEdit={editingTask} 
          setEditingTask={setEditingTask} 
        />
      </div>
      <div className="lg:w-2/3">
        <h2 className="text-3xl font-bold mb-4">Your Tasks</h2>
        <TaskList 
          tasks={tasks} 
          onTaskDeleted={handleTaskDeleted} 
          onTaskUpdated={handleTaskUpdated}
          onEditTask={handleEditTask}
        />
      </div>
    </div>
  );
};

export default DashboardPage;