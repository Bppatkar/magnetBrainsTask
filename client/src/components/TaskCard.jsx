import React from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const { handleUpdateTaskStatus, handleUpdateTaskPriority } = useTasks();

    const handleStatusToggle = (e) => {
        e.stopPropagation();
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        handleUpdateTaskStatus(task._id, newStatus);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(task);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(task._id);
    };

    return (
        <div
            className={`task-card bg-white p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 
            ${task.priority === 'high' ? 'border-red-500' : task.priority === 'medium' ? 'border-orange-500' : 'border-blue-500'}
            ${task.status === 'completed' ? 'opacity-60 line-through' : ''}`}
            draggable
        >
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg text-gray-800">{task.title}</h4>
                <div className="flex items-center space-x-2">
                    <button onClick={handleStatusToggle} className="text-gray-500 hover:text-green-500 transition-colors">
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                    <button onClick={handleEdit} className="text-gray-500 hover:text-blue-500 transition-colors">
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition-colors">
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Assigned To: {task.assignedTo?.username || 'N/A'}</p>
        </div>
    );
};

export default TaskCard;
