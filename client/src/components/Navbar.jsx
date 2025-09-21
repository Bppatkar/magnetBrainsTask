import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import { FaSignOutAlt, FaTasks } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-3xl font-bold flex items-center"
        >
          <FaTasks className="mr-2 text-blue-500" />
          TaskFlow
        </Link>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-200"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
