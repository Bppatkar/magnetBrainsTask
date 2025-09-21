import { useAuth } from '../context/AuthContext.jsx';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white/10 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="text-gray-400">Username</label>
            <p className="text-white text-lg">{user.username}</p>
          </div>
          <div>
            <label className="text-gray-400">Email</label>
            <p className="text-white text-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-gray-400">User ID</label>
            <p className="text-white text-sm font-mono">{user._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;