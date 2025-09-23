import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ onAddTask, onRefreshTasks }) => {
    const { logout } = useAuth();
    return (
        <header className="bg-indigo-600 text-white p-4 sm:p-6 shadow-md flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold">TaskFlow</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                    onClick={onAddTask}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                    <i className="fa-solid fa-plus mr-2"></i>New Task
                </button>
                <button
                    onClick={onRefreshTasks}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                    <i className="fa-solid fa-arrows-rotate"></i>
                </button>
                <button
                    onClick={logout}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
