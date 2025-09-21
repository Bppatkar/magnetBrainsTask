import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard.jsx';

const PriorityColumn = ({ priority, tasks, onEditTask }) => {
  const { setNodeRef } = useDroppable({
    id: priority,
    data: { priority },
  });

  const priorityConfig = {
    high: {
      title: 'High Priority',
      gradient: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
    },
    medium: {
      title: 'Medium Priority',
      gradient: 'from-yellow-500/20 to-yellow-600/10',
      border: 'border-yellow-500/30',
    },
    low: {
      title: 'Low Priority',
      gradient: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/30',
    },
  };

  const config = priorityConfig[priority];

  return (
    <div
      ref={setNodeRef}
      className={`bg-gradient-to-b ${config.gradient} backdrop-blur-md rounded-xl p-6 border-2 ${config.border} min-h-[600px]`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{config.title}</h2>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white">
          {tasks.length} tasks
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEditTask} />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No {priority} priority tasks</p>
              <p className="text-sm">Drag tasks here to change priority</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default PriorityColumn;
