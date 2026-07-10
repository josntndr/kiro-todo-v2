import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#22c55e' },
];

function KanbanBoard({ tasks, onMoveTask }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function getColumnTasks(columnId) {
    return tasks.filter((t) => t.status === columnId);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;

    // Determine the target column
    // The 'over' could be a column droppable or another card
    let targetStatus = null;

    // Check if dropped over a column directly
    if (COLUMNS.some((col) => col.id === over.id)) {
      targetStatus = over.id;
    } else {
      // Dropped over a card — find which column that card belongs to
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== targetStatus) {
        onMoveTask(taskId, targetStatus);
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            tasks={getColumnTasks(col.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
