import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import { FaEdit, FaTrash, FaUser, FaClock } from 'react-icons/fa';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, onEdit }) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { deleteTask, updateTask } = useTasks();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isTaskOwner = task.createdBy._id === user._id;
  const isAssignedToMe = task.assignedTo._id === user._id;

  const handleStatusChange = async () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task._id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 cursor-grab active:cursor-grabbing transition-all duration-200 group"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-white text-lg">{task.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.status === 'completed'
                ? 'bg-green-500/20 text-green-300'
                : 'bg-blue-500/20 text-blue-300'
            }`}
          >
            {task.status}
          </span>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center space-x-2">
            <FaClock />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaUser />
            <span>{task.assignedTo.username}</span>
          </div>
        </div>

        {(isTaskOwner || isAssignedToMe) && (
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex space-x-2">
              {isTaskOwner && (
                <>
                  <button
                    onClick={() => onEdit(task)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                    title="Edit Task"
                  >
                    <FaEdit className="text-blue-300" size={14} />
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <FaTrash className="text-red-300" size={14} />
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleStatusChange}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                task.status === 'completed'
                  ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                  : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
              }`}
            >
              {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete "${task.title}"?`}
      />
    </>
  );
};

export default TaskCard;
