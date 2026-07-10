import { Calendar, Repeat, Tag } from 'lucide-react';
import { isOverdue } from '../utils/taskUtils';

function KanbanCard({ task }) {
  const overdue = isOverdue(task);
  const subtaskCount = task.subtasks ? task.subtasks.length : 0;
  const subtaskDone = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className={`kanban-card ${overdue ? 'kanban-card-overdue' : ''}`}>
      <h4 className="kanban-card-title">{task.title}</h4>
      <div className="kanban-card-meta">
        <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className={`kanban-card-date ${overdue ? 'meta-overdue' : ''}`}>
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}
        {task.category && (
          <span className="kanban-card-category" title={task.category}>
            <Tag size={11} />
            <span className="category-text">{task.category}</span>
          </span>
        )}
        {task.recurrence && task.recurrence !== 'none' && (
          <span className="kanban-card-recurrence">
            <Repeat size={12} />
          </span>
        )}
      </div>
      {subtaskCount > 0 && (
        <div className="kanban-card-subtasks">
          <div className="kanban-subtask-bar">
            <div
              className="kanban-subtask-fill"
              style={{ width: `${Math.round((subtaskDone / subtaskCount) * 100)}%` }}
            />
          </div>
          <span className="kanban-subtask-text">{subtaskDone}/{subtaskCount}</span>
        </div>
      )}
    </div>
  );
}

export default KanbanCard;
