import { useState, useEffect } from 'react';
import api from '../api/api';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const TaskForm = ({ onTaskCreated, onTaskUpdated, taskToEdit, setEditingTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: '' 
  });

  // Populate form if a task is being edited
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate.substring(0, 10),
        priority: taskToEdit.priority,
        assignedTo: taskToEdit.assignedTo,
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
      assignedTo: '',
    });
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit._id}`, formData);
        onTaskUpdated();
      } else {
        // You'll need to fetch the current user's ID from context to set assignedTo
        // For now, let's assume you've hardcoded it or fetched it
        // and add it to the formData before submitting.
        const res = await api.post('/tasks', { ...formData, assignedTo: "Your_User_ID_Here" });
        onTaskCreated();
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-400 mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-400 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-gray-400 mb-2">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="priority" className="block text-gray-400 mb-2">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center p-3 rounded-md font-semibold text-white transition-colors duration-200 bg-blue-600 hover:bg-blue-700"
        >
          {taskToEdit ? <><FaSave className="mr-2" /> Save Changes</> : <><FaPlus className="mr-2" /> Add Task</>}
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