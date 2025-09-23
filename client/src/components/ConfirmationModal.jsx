import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-4 border-indigo-500">
        <FaExclamationTriangle className="text-indigo-500 text-5xl mx-auto mb-4 drop-shadow-lg" />
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Are you sure?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
