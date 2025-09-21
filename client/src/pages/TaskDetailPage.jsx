import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import {
  FaTag,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaEdit,
} from 'react-icons/fa';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
        setError(null);
      } catch (err) {
        console.error('Fetch task error:', err);
        setError(
          err.response?.data?.message || 'Failed to fetch task details.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, isEditing]);

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const isTaskOwner = task && user && task.createdBy._id === user._id;

  if (loading)
    return (
      <div className="text-center mt-8 text-white text-xl">
        Loading task details...
      </div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;
  if (!task)
    return (
      <div className="text-center mt-8 text-white text-xl">Task not found.</div>
    );

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition duration-200 flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          {isTaskOwner && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-200"
            >
              <FaEdit className="mr-2" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Task'}</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <TaskForm taskToEdit={task} setEditingTask={handleEditComplete} />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-white">{task.title}</h1>
              {isTaskOwner && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Your Task
                </span>
              )}
            </div>

            <p className="text-gray-300 mb-6 text-lg">{task.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 text-gray-300">
                <FaTag
                  className={`text-xl ${getPriorityColor(task.priority)}`}
                />
                <div>
                  <span className="font-semibold text-white">Priority:</span>
                  <p className="capitalize">{task.priority}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <FaClock className="text-xl text-yellow-500" />
                <div>
                  <span className="font-semibold text-white">Status:</span>
                  <p className="capitalize">{task.status}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <FaCalendarAlt className="text-xl text-blue-500" />
                <div>
                  <span className="font-semibold text-white">Due Date:</span>
                  <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <FaUser className="text-xl text-green-500" />
                <div>
                  <span className="font-semibold text-white">Created By:</span>
                  <p className="font-medium text-white">
                    {task.createdBy.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    {task.createdBy.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <FaClock className="text-xl text-purple-500" />
                <div>
                  <span className="font-semibold text-white">Created At:</span>
                  <p>{new Date(task.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <FaClock className="text-xl text-purple-500" />
                <div>
                  <span className="font-semibold text-white">
                    Last Updated:
                  </span>
                  <p>{new Date(task.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {!isTaskOwner && (
              <div className="mt-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> This task was created by{' '}
                  {task.createdBy.username}. You can view the details but cannot
                  edit or delete it.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;
