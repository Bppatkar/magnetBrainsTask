import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import { FaEdit, FaTrash, FaUser, FaClock, FaCheck, FaUndo, FaEye, FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, onEdit }) => {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const { deleteTask, updateTask } = useTasks();
  const navigate = useNavigate();

  // Permission logic
  const isTaskOwner = task.createdBy._id === user._id;
  const isAssignedToMe = task.assignedTo._id === user._id;
  const canEditTask = isTaskOwner;
  const canDeleteTask = isTaskOwner;
  const canChangeStatus = isTaskOwner || isAssignedToMe;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    disabled: !isTaskOwner,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isTaskOwner ? 'grab' : 'default',
  };

  const handleStatusChange = async (newStatus) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      await updateTask(task._id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
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

  const handleViewDetails = () => {
    navigate(`/tasks/${task._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (canEditTask) {
      onEdit(task);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (canDeleteTask) {
      setShowModal(true);
    }
  };

  const priorityColors = {
    high: 'bg-red-500/20 border-red-500/30',
    medium: 'bg-yellow-500/20 border-yellow-500/30',
    low: 'bg-green-500/20 border-green-500/30'
  };

  return (
    <>
      <div
        ref={isTaskOwner ? setNodeRef : null}
        style={style}
        {...(isTaskOwner ? attributes : {})}
        {...(isTaskOwner ? listeners : {})}
        className={`bg-white/5 backdrop-blur-sm rounded-lg p-4 border ${priorityColors[task.priority]} hover:border-cyan-400/30 transition-all duration-200 group relative`}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-white text-lg">{task.title}</h3>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.status === 'completed'
                  ? 'bg-green-500/20 text-green-300'
                  : task.status === 'rejected'
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}
            >
              {task.status}
            </span>
            {isTaskOwner && (
              <span className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-full">
                Your Task
              </span>
            )}
          </div>
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

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex space-x-2">
            {/* View details button - always visible */}
            <button
              onClick={handleViewDetails}
              className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
              title="View Details"
            >
              <FaEye className="text-purple-300" size={14} />
            </button>

            {/* Edit button - only for task owner */}
            {canEditTask && (
              <button
                onClick={handleEdit}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                title="Edit Task"
              >
                <FaEdit className="text-blue-300" size={14} />
              </button>
            )}

            {/* Delete button - only for task owner */}
            {canDeleteTask && (
              <button
                onClick={handleDeleteClick}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                title="Delete Task"
              >
                <FaTrash className="text-red-300" size={14} />
              </button>
            )}
          </div>

          {/* Status buttons - for task owner or assigned user */}
          {canChangeStatus && (
            <div className="flex space-x-2">
              {task.status !== 'rejected' && (
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={isUpdating}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors flex items-center space-x-1 disabled:opacity-50"
                  title="Reject Task"
                >
                  <FaBan size={10} />
                  <span>Reject</span>
                </button>
              )}
              
              {task.status === 'completed' ? (
                <button
                  onClick={() => handleStatusChange('pending')}
                  disabled={isUpdating}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-colors flex items-center space-x-1 disabled:opacity-50"
                  title="Mark Pending"
                >
                  <FaUndo size={10} />
                  <span>Pending</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={isUpdating}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors flex items-center space-x-1 disabled:opacity-50"
                  title="Mark Complete"
                >
                  <FaCheck size={10} />
                  <span>Complete</span>
                </button>
              )}
            </div>
          )}
        </div>
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