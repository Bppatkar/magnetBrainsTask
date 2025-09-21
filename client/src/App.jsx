import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { TaskProvider } from './context/TaskContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TaskDetailPage from './pages/TaskDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't show navbar on dashboard pages
  const showNavbar = !location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? 'container mx-auto p-4' : ''}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <PrivateRoute>
                <TaskDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
