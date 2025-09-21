import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal.jsx';
import {
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaHourglassHalf,
} from 'react-icons/fa';
import { useTasks } from '../hooks/useTasks.jsx';

const TaskList = ({ tasks, onEditTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { updateTask, deleteTask } = useTasks();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return 'border-l-4 border-gray-700';
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete._id);
      setShowModal(false);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(taskId, { status: newStatus });
  };

  if (tasks.length === 0) {
    return (
      <p className="text-gray-400 mt-4 text-center">
        No tasks found. Create a new one!
      </p>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-4 rounded-lg shadow-md bg-gray-800 ${getPriorityColor(
            task.priority
          )}`}
        >
          <div className="flex-1">
            <Link to={`/tasks/${task._id}`} className="hover:underline">
              <h3 className="text-xl font-semibold text-white">{task.title}</h3>
            </Link>
            <p className="text-gray-300 mt-1">{task.description}</p>
            <p className="text-sm mt-2 text-gray-400">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full capitalize mt-2 inline-block ${
                task.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
              }`}
            >
              {task.status}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => handleStatusChange(task._id, task.status)}
              className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200"
              title="Toggle Status"
            >
              {task.status === 'completed' ? (
                <FaCheckCircle />
              ) : (
                <FaHourglassHalf />
              )}
            </button>
            <button
              onClick={() => onEditTask(task)}
              className="p-2 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-200"
              title="Edit Task"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteClick(task)}
              className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200"
              title="Delete Task"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
      />
    </div>
  );
};

export default TaskList;