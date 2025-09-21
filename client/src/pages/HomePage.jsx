import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import { useEffect } from 'react';
import { FaTasks, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const HomePage = () => {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    } else {
      fetchTasks();
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Modern Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-white text-3xl font-bold flex items-center"
          >
            <FaTasks className="mr-3 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <FaTasks className="text-cyan-400 text-6xl mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Organize Your Workflow with
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}
              TaskFlow
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Collaborate, prioritize, and complete tasks with your team.
            Beautiful design, powerful features.
          </p>

          {!user && (
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto shadow-xl mb-16"
            >
              <FaUserPlus />
              <span>Get Started Free</span>
            </Link>
          )}
        </div>

        {/* Public Tasks Preview */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Recent Team Tasks
          </h2>
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.slice(0, 6).map((task) => (
                <div
                  key={task._id}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-gray-400 text-sm">
                      By {task.createdBy?.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-lg">
              No tasks yet. Be the first to create one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
