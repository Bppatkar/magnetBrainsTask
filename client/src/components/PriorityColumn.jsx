import TaskCard from './TaskCard.jsx';
import { useTasks } from '../context/TaskContext.jsx';

const PriorityColumn = ({ title, priority, tasks, onEditTask, onDeleteTask }) => {
    const { handleUpdateTaskPriority } = useTasks();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain');
        handleUpdateTaskPriority(taskId, priority);
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('text/plain', taskId);
    };

    return (
        <div
            className="priority-column drop-zone bg-white rounded-lg p-4 shadow-md flex-1 overflow-y-auto"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h3 className={`text-xl font-bold mb-4 pb-2 border-b-2 
                ${priority === 'high' ? 'text-red-600 border-red-300' : priority === 'medium' ? 'text-orange-600 border-orange-300' : 'text-blue-600 border-blue-300'}`}>
                {title}
            </h3>
            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task._id} onDragStart={(e) => handleDragStart(e, task._id)}>
                        <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className="text-center text-gray-400 text-sm">No tasks in this category.</p>
                )}
            </div>
        </div>
    );
};

export default PriorityColumn;
