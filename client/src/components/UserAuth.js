import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Implement registration logic here using api.post('/auth/register', ...)
        console.log("Registration logic to be implemented.");
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-gray-400">
          {isRegister ? 'Already have an account?' : 'Need an account?'}
        </span>
        <button onClick={() => setIsRegister(!isRegister)} className="ml-2 text-blue-400 hover:underline">
          {isRegister ? 'Login' : 'Register'}
        </button>
      </div>
    </div>
  );
};

export default UserAuth;