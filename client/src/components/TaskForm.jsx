import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';

const TaskForm = ({ taskToEdit, setEditingTask, onSuccess }) => {
  const { user } = useAuth();
  const { createTask, updateTask, users } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate.split('T')[0]);
      setPriority(taskToEdit.priority);
      setAssignedTo(taskToEdit.assignedTo._id); 
    } else {
      // Set default assigned to current user
      setAssignedTo(user._id);
    }
  }, [taskToEdit, user]);

  // Remove duplicate users and ensure current user is included
  const getAvailableUsers = () => {
    const uniqueUsers = [];
    const userIds = new Set();
    
    // Add current user first
    if (user && !userIds.has(user._id)) {
      uniqueUsers.push(user);
      userIds.add(user._id);
    }
    
    // Add other users from context
    if (users && users.length > 0) {
      users.forEach(userOption => {
        if (!userIds.has(userOption._id)) {
          uniqueUsers.push(userOption);
          userIds.add(userOption._id);
        }
      });
    }
    
    return uniqueUsers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const taskData = {
        title,
        description,
        dueDate,
        priority,
        assignedTo
      };

      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskData);
      } else {
        await createTask(taskData);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const availableUsers = getAvailableUsers();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">
        {taskToEdit ? 'Edit Task' : 'Create New Task'}
      </h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Due Date *
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Assign To
        </label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {availableUsers.map((userOption) => (
            <option key={userOption._id} value={userOption._id}>
              {userOption.username} {userOption._id === user._id ? '(You)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Create Task'}
        </button>
        
        {taskToEdit && (
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;