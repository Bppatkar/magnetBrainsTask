import { useEffect } from 'react';
import TaskList from '../components/TaskList.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useTasks } from '../context/TaskProvider.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks } = useTasks();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

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
        <TaskForm />
      </div>
      <div className="lg:w-2/3">
        <h2 className="text-3xl font-bold mb-4">Your Tasks</h2>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
};

export default DashboardPage;
