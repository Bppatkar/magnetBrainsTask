import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const PriorityColumn = ({ priority, tasks, onEditTask }) => {
  const { setNodeRef } = useDroppable({
    id: priority,
    data: {
      priority,
    },
  });

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h2 className="text-xl font-bold mb-4 capitalize text-white">
        {priority} Priority
      </h2>
      
      <div ref={setNodeRef} className="space-y-4 min-h-[200px]">
        <SortableContext 
          items={tasks.map(task => task._id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <p className="text-gray-400 text-center py-4">No tasks</p>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default PriorityColumn;