import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { tasksAPI, usersAPI } from '../services/api';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // console.log('Fetching users...');
      const response = await usersAPI.getUsers();
      // console.log('Users API response:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.log('Error details:', error.response);
      // Fallback: at least show current user
      setUsers([
        {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      ]);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error.response?.data?.message || 'Error creating task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.updateTask(editingTask._id, taskData);
      setShowModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error.response?.data?.message || 'Error updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(error.response?.data?.message || 'Error deleting task');
      }
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await tasksAPI.updateTaskStatus(taskId, status);
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const handlePriorityUpdate = async (taskId, priority) => {
    try {
      await tasksAPI.updateTaskPriority(taskId, priority);
      fetchTasks();
    } catch (error) {
      console.error('Error updating priority:', error);
      alert(error.response?.data?.message || 'Error updating priority');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (!task || !task.assignedTo || !task.createdBy || !user) return false;

    switch (filter) {
      case 'all':
        return true;
      case 'assigned':
        return task.assignedTo._id === user._id;
      case 'created':
        return task.createdBy._id === user._id;
      default:
        return true;
    }
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
            <p className="text-gray-600">Manage your tasks efficiently</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'assigned'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Assigned to Me
          </button>
          <button
            onClick={() => setFilter('created')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'created'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Created by Me
          </button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onStatusUpdate={handleStatusUpdate}
          onPriorityUpdate={handlePriorityUpdate}
          user={user}
          loading={loading}
        />

        {/* Create/Edit Task Modal */}
        <Modal
          isOpen={showModal || !!editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowModal(false);
              setEditingTask(null);
            }}
            users={users}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Dashboard;
