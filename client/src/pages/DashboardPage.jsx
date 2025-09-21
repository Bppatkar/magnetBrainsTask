import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

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

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      <div className="lg:w-1/3">
        <TaskForm taskToEdit={editingTask} setEditingTask={setEditingTask} />
      </div>
      <div className="lg:w-2/3">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Your's and Other's Tasks
        </h2>
        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">
            {error}
            <button
              onClick={fetchTasks}
              className="ml-4 underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}
        <TaskList tasks={tasks} onEditTask={handleEditTask} />
      </div>
    </div>
  );
};

export default DashboardPage;
