import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../hooks/useTasks.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  if (loading) {
    return (
      <div className="text-center mt-8 text-white text-xl">
        Loading tasks...
      </div>
    );
  }
  if (error)
    return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      <div className="lg:w-1/3">
        <TaskForm taskToEdit={editingTask} setEditingTask={setEditingTask} />
      </div>
      <div className="lg:w-2/3">
        <h2 className="text-3xl font-bold mb-4 text-white">Your Tasks</h2>
        <TaskList tasks={tasks} onEditTask={handleEditTask} />
      </div>
    </div>
  );
};

export default DashboardPage;