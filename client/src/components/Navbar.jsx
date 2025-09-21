import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FaSignOutAlt, FaTasks, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-3xl font-bold flex items-center"
        >
          <FaTasks className="mr-2 text-blue-500" />
          TaskFlow
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-white bg-blue-600 px-3 py-1 rounded-full">
              <FaUser className="mr-2" />
              <span className="font-medium">{user.username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
