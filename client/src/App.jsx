import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { TaskProvider } from './context/TaskContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null; // Or a loading spinner
  return currentUser ? children : <Navigate to="/login" />;
};

const AuthRoutes = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? <Navigate to="/dashboard" /> : children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRoutes>
            <LoginPage />
          </AuthRoutes>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoutes>
            <RegisterPage />
          </AuthRoutes>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
