import { ClipboardList } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

function SortableTaskCard({ task, onEdit, onDelete, onToggleComplete, onToggleSubtask, onAddSubtask, onRemoveSubtask, onArchive }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onToggleSubtask={onToggleSubtask}
        onAddSubtask={onAddSubtask}
        onRemoveSubtask={onRemoveSubtask}
        onArchive={onArchive}
        dragHandleProps={listeners}
      />
    </div>
  );
}

function TaskList({ tasks, onEdit, onDelete, onToggleComplete, onToggleSubtask, onAddSubtask, onRemoveSubtask, onReorder, onArchive }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(tasks, oldIndex, newIndex);
      onReorder(reordered);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={48} className="empty-state-icon" />
        <h3>No tasks found</h3>
        <p>Add a new task or adjust your search and filters.</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="task-list">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
              onRemoveSubtask={onRemoveSubtask}
              onArchive={onArchive}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default TaskList;
