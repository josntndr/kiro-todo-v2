import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanCard from './KanbanCard';

function SortableKanbanCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard task={task} />
    </div>
  );
}

function KanbanColumn({ id, title, tasks, color }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`kanban-column ${isOver ? 'kanban-column-over' : ''}`} ref={setNodeRef}>
      <div className="kanban-column-header" style={{ borderTopColor: color }}>
        <h3 className="kanban-column-title">{title}</h3>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="kanban-column-body">
          {tasks.map((task) => (
            <SortableKanbanCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <p className="kanban-column-empty">No tasks</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default KanbanColumn;
