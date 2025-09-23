import { useState } from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import PriorityColumn from '../components/PriorityColumn.jsx';
import TaskForm from '../components/TaskForm.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import Navbar from '../components/Navbar.jsx';

const DashboardPage = () => {
  const { tasks, loading, error, fetchTasks, handleDeleteTask } = useTasks();
  const { currentUser } = useAuth();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const openTaskFormModal = (task = null) => {
    setTaskToEdit(task);
    setIsFormModalOpen(true);
  };

  const openConfirmationModal = (taskId) => {
    setTaskToDeleteId(taskId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteTask(taskToDeleteId);
    setIsConfirmModalOpen(false);
    setTaskToDeleteId(null);
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );
  const highPriorityTasks = sortedTasks.filter(
    (task) => task.priority === 'high'
  );
  const mediumPriorityTasks = sortedTasks.filter(
    (task) => task.priority === 'medium'
  );
  const lowPriorityTasks = sortedTasks.filter(
    (task) => task.priority === 'low'
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        onAddTask={() => openTaskFormModal(null)}
        onRefreshTasks={fetchTasks}
      />
      <div className="p-4 sm:p-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        {loading && (
          <div className="text-center text-gray-500">Loading tasks...</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriorityColumn
            title="High Priority"
            priority="high"
            tasks={highPriorityTasks}
            onEditTask={openTaskFormModal}
            onDeleteTask={openConfirmationModal}
          />
          <PriorityColumn
            title="Medium Priority"
            priority="medium"
            tasks={mediumPriorityTasks}
            onEditTask={openTaskFormModal}
            onDeleteTask={openConfirmationModal}
          />
          <PriorityColumn
            title="Low Priority"
            priority="low"
            tasks={lowPriorityTasks}
            onEditTask={openTaskFormModal}
            onDeleteTask={openConfirmationModal}
          />
        </div>
      </div>

      {isFormModalOpen && (
        <TaskForm
          taskToEdit={taskToEdit}
          onClose={() => setIsFormModalOpen(false)}
          currentUser={currentUser}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default DashboardPage;
