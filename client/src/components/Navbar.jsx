import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FaSignOutAlt, FaTasks, FaHome, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
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
            <>
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <FaHome />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </div>

              <span className="text-gray-300 hidden md:block">
                Welcome,{' '}
                <span className="text-white font-semibold">
                  {user.username}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300"
              >
                <FaSignOutAlt />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300"
              >
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
