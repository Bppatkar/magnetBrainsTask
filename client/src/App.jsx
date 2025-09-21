import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { TaskProvider } from './context/TaskContext.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import DashboardPage from './pages/DashboardPage.js';
import TaskDetailPage from './pages/TaskDetailPage.js';
import PrivateRoute from './components/PrivateRoute.js';
import Navbar from './components/Navbar.js';
import './styles.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
