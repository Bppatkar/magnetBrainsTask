import { FiEdit, FiTrash2, FiClock, FiUser } from 'react-icons/fi';
import { TASK_PRIORITIES, TASK_STATUS } from '../utils/constants';

const TaskCard = ({ task, onEdit, onDelete, onStatusUpdate, onPriorityUpdate, user }) => {
  const isCreator = task.createdBy._id === user?._id;
  const isAssigned = task.assignedTo._id === user?._id;
  const isAdmin = user?.role === 'admin';

  const canEdit = isCreator || isAdmin;
  const canDelete = isCreator || isAdmin;
  const canUpdateStatus = isAssigned || isAdmin;
  const canUpdatePriority = isCreator || isAdmin;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex space-x-2">
          {canEdit && (
            <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-800">
              <FiEdit className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => onDelete(task._id)} className="text-red-600 hover:text-red-800">
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-500">
            <FiClock className="mr-2" />
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
          
          {canUpdateStatus && (
            <select 
              value={task.status}
              onChange={(e) => onStatusUpdate(task._id, e.target.value)}
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
            >
              {Object.entries(TASK_STATUS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-500">
            <FiUser className="mr-2" />
            Assigned to: {task.assignedTo.username}
          </span>
          
          {canUpdatePriority && (
            <select 
              value={task.priority}
              onChange={(e) => onPriorityUpdate(task._id, e.target.value)}
              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
            >
              {Object.entries(TASK_PRIORITIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Created by: {task.createdBy.username}</span>
          <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;