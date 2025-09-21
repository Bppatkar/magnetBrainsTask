import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { FaTag, FaClock, FaCalendarAlt, FaUser, FaArrowLeft, FaEdit } from 'react-icons/fa';
import TaskForm from '../components/TaskForm.jsx';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, isEditing]);

  const handleEditComplete = () => {
    setIsEditing(false);
  };

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

  if (loading) return <div className="text-center mt-8 text-white text-xl">Loading task details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;
  if (!task) return <div className="text-center mt-8 text-white text-xl">Task not found.</div>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition duration-200 flex items-center space-x-2">
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-200">
            <FaEdit className="mr-2" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Task'}</span>
          </button>
        </div>

        {isEditing ? (
          <TaskForm taskToEdit={task} setEditingTask={handleEditComplete} />
        ) : (
          <div>
            <h1 className="text-4xl font-bold mb-2">{task.title}</h1>
            <p className="text-gray-300 mb-6">{task.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 text-gray-300">
                <FaTag className={`text-xl ${getPriorityColor(task.priority)} rounded-full p-1`} />
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
                  <span className="font-semibold text-white">Assigned To:</span>
                  <p>{task.assignedTo?.username || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <FaUser className="text-xl text-green-500" />
                <div>
                  <span className="font-semibold text-white">Created By:</span>
                  <p>{task.createdBy?.username || 'N/A'}</p>
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
                  <span className="font-semibold text-white">Last Updated:</span>
                  <p>{new Date(task.updatedAt).toLocaleString()}</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;
