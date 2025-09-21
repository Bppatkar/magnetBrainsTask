import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const TaskForm = ({ taskToEdit, setEditingTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addTask, updateTask } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate.substring(0, 10),
        priority: taskToEdit.priority,
      });
    } else {
      resetForm();
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    if (setEditingTask) {
      setEditingTask(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const taskDataWithUser = { ...formData, assignedTo: user._id };

      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskDataWithUser);
        if (setEditingTask) {
          setEditingTask(null);
        }
        navigate('/dashboard');
      } else {
        await addTask(taskDataWithUser);
      }
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save task');
      console.error('Failed to save task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4 text-white">
        {taskToEdit ? 'Edit Task' : 'Create New Task'}
      </h3>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-400 mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-400 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          rows="4"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-gray-400 mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="priority" className="block text-gray-400 mb-2">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className={`flex-1 flex items-center justify-center p-3 rounded-md font-semibold text-white transition-colors duration-200 bg-blue-600 hover:bg-blue-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            'Saving...'
          ) : taskToEdit ? (
            <>
              <FaSave className="mr-2" /> Save Changes
            </>
          ) : (
            <>
              <FaPlus className="mr-2" /> Add Task
            </>
          )}
        </button>
        {taskToEdit && (
          <button
            type="button"
            onClick={resetForm}
            className="p-3 rounded-md font-semibold text-white transition-colors duration-200 bg-gray-500 hover:bg-gray-600"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
