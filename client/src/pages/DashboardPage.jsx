import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import TaskForm from '../components/TaskForm.jsx';
import PriorityColumn from '../components/PriorityColumn.jsx';
import { FaPlus, FaHome } from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, updateTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (location.state?.fromLogin) {
      console.log('Welcome back!');
    }
  }, [location]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newPriority = over.data.current?.priority;

    if (!taskId || !newPriority) return;

    try {
      await updateTask(taskId, { priority: newPriority });
    } catch (error) {
      console.error('Failed to update task priority:', error);
      alert('Failed to update task priority. Please try again.');
    }
  };

  const priorities = ['high', 'medium', 'low'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Navigation Bar */}
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 mt-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Team Dashboard</h1>
            <p className="text-gray-300">
              Welcome back, {user?.username}! Manage your team's tasks.
            </p>
            <p className="text-sm text-cyan-300 mt-1">
              You can only update tasks you created
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full flex items-center space-x-2 transition-all duration-300 mt-4 lg:mt-0"
          >
            <FaPlus />
            <span>{showForm ? 'Close Form' : 'New Task'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
            <TaskForm
              taskToEdit={editingTask}
              setEditingTask={setEditingTask}
              onSuccess={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {priorities.map((priority) => (
              <PriorityColumn
                key={priority}
                priority={priority}
                tasks={tasks.filter((task) => task.priority === priority)}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default DashboardPage;
