import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal.jsx';
import {
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaHourglassHalf,
  FaUser,
  FaClock,
} from 'react-icons/fa';
import { useTasks } from '../context/TaskContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const TaskList = ({ tasks, onEditTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { updateTask, deleteTask } = useTasks();
  const { user } = useAuth();

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
      try {
        await deleteTask(taskToDelete._id);
        setShowModal(false);
        setTaskToDelete(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Status update failed:', error);
      alert(
        'Failed to update status: ' +
          (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  const isTaskOwner = (task) => {
    return task.createdBy._id === user._id;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">No tasks found.</p>
        <p className="text-gray-500 text-sm mt-2">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 mb-4 rounded-lg shadow-md bg-gray-800 ${getPriorityColor(
            task.priority
          )}`}
        >
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <Link to={`/tasks/${task._id}`} className="hover:underline">
                <h3 className="text-xl font-semibold text-white">
                  {task.title}
                </h3>
              </Link>
              {isTaskOwner(task) && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Your Task
                </span>
              )}
            </div>

            <p className="text-gray-300 mt-1 mb-3">{task.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <FaClock className="mr-1" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center">
                <FaUser className="mr-1" />
                <span>
                  Created by:{' '}
                  <strong className="text-white">
                    {task.createdBy.username}
                  </strong>
                </span>
              </div>

              <div className="flex items-center">
                <FaClock className="mr-1" />
                <span>
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-medium px-3 py-1 rounded-full capitalize mt-3 inline-block ${
                task.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
              }`}
            >
              {task.status}
            </span>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {/* Only show action buttons if user owns the task */}
            {isTaskOwner(task) ? (
              <>
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
              </>
            ) : (
              <div className="text-gray-500 text-sm px-3 py-1 bg-gray-700 rounded-full">
                View Only
              </div>
            )}
          </div>
        </div>
      ))}

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete the task "${taskToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TaskList;
