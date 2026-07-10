import { CheckCircle2, Circle, Edit3, Trash2, Calendar, Tag, Repeat, GripVertical, Zap, Archive } from 'lucide-react';
import { isOverdue } from '../utils/taskUtils';
import SubtaskList from './SubtaskList';

function TaskCard({ task, onEdit, onDelete, onToggleComplete, onToggleSubtask, onAddSubtask, onRemoveSubtask, onArchive, dragHandleProps }) {
  const overdue = isOverdue(task);

  function handleDelete() {
    onDelete(task.id);
  }

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const cardClasses = [
    'task-card',
    task.completed ? 'task-completed' : '',
    overdue ? 'task-overdue' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const subtaskCount = task.subtasks ? task.subtasks.length : 0;
  const subtaskDone = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

  // Status label
  const statusLabel = task.completed ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'To Do';
  const statusClass = task.completed ? 'status-done' : task.status === 'in-progress' ? 'status-progress' : 'status-todo';

  return (
    <div className={cardClasses}>
      <div className="task-card-header">
        {dragHandleProps && (
          <button className="btn-drag-handle" {...dragHandleProps} aria-label="Drag to reorder">
            <GripVertical size={16} />
          </button>
        )}

        <button
          className="btn-toggle"
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
          type="button"
        >
          {task.completed ? (
            <CheckCircle2 size={22} className="icon-completed" />
          ) : (
            <Circle size={22} className="icon-pending" />
          )}
        </button>

        <div className="task-card-content">
          <h3 className="task-card-title">{task.title}</h3>
          {task.description && (
            <p className="task-card-description">{task.description}</p>
          )}

          <div className="task-card-meta">
            <span className={`status-badge ${statusClass}`}>
              {statusLabel}
            </span>
            <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className={`meta-item ${overdue ? 'meta-overdue' : ''}`}>
                <Calendar size={13} />
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.category && (
              <span className="meta-item meta-category" title={task.category}>
                <Tag size={13} />
                <span className="category-text">{task.category}</span>
              </span>
            )}
            {task.recurrence && task.recurrence !== 'none' && (
              <span className="meta-item meta-recurrence">
                <Repeat size={13} />
                {task.recurrence}
              </span>
            )}
            {subtaskCount > 0 && (
              <span className="meta-item meta-subtasks">
                <Zap size={13} />
                {subtaskDone}/{subtaskCount}
              </span>
            )}
          </div>

          {/* Tags display */}
          {task.tags && task.tags.length > 0 && (
            <div className="task-card-tags">
              {task.tags.map((tag) => (
                <span key={tag} className="tag-chip tag-chip-small">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="task-card-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            type="button"
          >
            <Edit3 size={16} />
          </button>
          {onArchive && (
            <button
              className="btn-icon"
              onClick={() => onArchive(task.id)}
              aria-label="Archive task"
              type="button"
              title="Archive"
            >
              <Archive size={16} />
            </button>
          )}
          <button
            className="btn-icon btn-icon-danger"
            onClick={handleDelete}
            aria-label="Delete task"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Subtasks section */}
      {(subtaskCount > 0 || !task.completed) && (
        <div className="task-card-subtasks">
          <SubtaskList
            subtasks={task.subtasks || []}
            taskId={task.id}
            onToggleSubtask={onToggleSubtask}
            onAddSubtask={onAddSubtask}
            onRemoveSubtask={onRemoveSubtask}
          />
        </div>
      )}
    </div>
  );
}

export default TaskCard;
