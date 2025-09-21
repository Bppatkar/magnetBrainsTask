import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUsers } from '../context/UserContext.jsx'; 
import { FaSave, FaTimes, FaUser } from 'react-icons/fa';

const TaskForm = ({ taskToEdit, setEditingTask, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addTask, updateTask } = useTasks();
  const { user } = useAuth();
  const { users, fetchUsers } = useUsers(); // Fetch all users for assignment

  useEffect(() => {
    fetchUsers(); // Fetch users when form opens
  }, []);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate.substring(0, 10),
        priority: taskToEdit.priority,
        assignedTo: taskToEdit.assignedTo._id
      });
    } else {
      setFormData(prev => ({ ...prev, assignedTo: user._id }));
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, formData);
        setEditingTask(null);
      } else {
        await addTask(formData);
      }
      onSuccess?.();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold text-white">
        {taskToEdit ? 'Edit Task' : 'Create New Task'}
      </h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Due Date *</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows="4"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Assign To</label>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 transition-all duration-300 disabled:opacity-50"
        >
          <FaSave />
          <span>{loading ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}</span>
        </button>

        {taskToEdit && (
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="bg-gray-500/20 hover:bg-gray-500/30 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-all duration-300 border border-gray-500/30"
          >
            <FaTimes />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;