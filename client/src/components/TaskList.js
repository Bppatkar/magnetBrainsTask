import { useState } from 'react';
import api from '../api/api';
import ConfirmationModal from './ConfirmationModal';
import { FaTrash, FaEdit, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const TaskList = ({ tasks, onTaskDeleted, onTaskUpdated, onEditTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-high-priority';
      case 'medium':
        return 'bg-medium-priority';
      case 'low':
        return 'bg-low-priority';
      default:
        return 'bg-gray-700';
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      onTaskDeleted();
      setShowModal(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      onTaskUpdated();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  if (tasks.length === 0) {
    return <p className="text-gray-400 mt-4">No tasks found. Create a new one!</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-4 rounded-lg shadow-md ${getPriorityColor(task.priority)} bg-opacity-30`}
        >
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-gray-300 mt-1">{task.description}</p>
            <p className="text-sm mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <span className={`text-sm font-medium px-2 py-1 rounded-full capitalize mt-2 inline-block ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
              {task.status}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button onClick={() => handleStatusChange(task._id, task.status === 'pending' ? 'completed' : 'pending')} 
                    className="p-2 text-white bg-green-600 rounded-full hover:bg-green-700"
                    title="Toggle Status">
              {task.status === 'pending' ? <FaCheckCircle /> : <FaHourglassHalf />}
            </button>
            <button onClick={() => onEditTask(task)} 
                    className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                    title="Edit Task">
              <FaEdit />
            </button>
            <button onClick={() => handleDeleteClick(task)} 
                    className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700"
                    title="Delete Task">
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