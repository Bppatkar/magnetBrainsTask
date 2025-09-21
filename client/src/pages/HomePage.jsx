import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { FaArrowRight, FaTasks, FaUserCheck } from 'react-icons/fa';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <FaTasks className="text-blue-500 text-6xl mb-6" />
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
        TaskFlow
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
        Organize your life and boost productivity with a simple yet powerful task management application.
      </p>
      {user ? (
        <Link 
          to="/dashboard" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-200 flex items-center space-x-2"
        >
          <FaUserCheck />
          <span>Go to Dashboard</span>
        </Link>
      ) : (
        <Link 
          to="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-200 flex items-center space-x-2"
        >
          <span>Get Started</span>
          <FaArrowRight />
        </Link>
      )}
    </div>
  );
};

export default HomePage;
