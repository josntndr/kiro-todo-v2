import { useState } from 'react';
import { Plus, X, CheckSquare, Square } from 'lucide-react';
import { generateId } from '../utils/taskUtils';

function SubtaskList({ subtasks, taskId, onToggleSubtask, onAddSubtask, onRemoveSubtask }) {
  const [newSubtask, setNewSubtask] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    onAddSubtask(taskId, { id: generateId(), title: newSubtask.trim(), completed: false });
    setNewSubtask('');
  }

  if (!subtasks || subtasks.length === 0) {
    return (
      <div className="subtask-list subtask-list-empty">
        <form className="subtask-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Add a subtask..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            className="subtask-input"
          />
          <button type="submit" className="btn-icon btn-subtask-add" aria-label="Add subtask">
            <Plus size={14} />
          </button>
        </form>
      </div>
    );
  }

  const completedCount = subtasks.filter((s) => s.completed).length;
  const progress = Math.round((completedCount / subtasks.length) * 100);

  return (
    <div className="subtask-list">
      <div className="subtask-progress">
        <div className="subtask-progress-bar">
          <div className="subtask-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="subtask-progress-text">
          {completedCount}/{subtasks.length}
        </span>
      </div>

      <ul className="subtask-items">
        {subtasks.map((subtask) => (
          <li key={subtask.id} className={`subtask-item ${subtask.completed ? 'subtask-done' : ''}`}>
            <button
              type="button"
              className="btn-subtask-toggle"
              onClick={() => onToggleSubtask(taskId, subtask.id)}
              aria-label={subtask.completed ? 'Mark subtask as pending' : 'Mark subtask as done'}
            >
              {subtask.completed ? <CheckSquare size={14} /> : <Square size={14} />}
            </button>
            <span className="subtask-title">{subtask.title}</span>
            <button
              type="button"
              className="btn-icon btn-subtask-remove"
              onClick={() => onRemoveSubtask(taskId, subtask.id)}
              aria-label="Remove subtask"
            >
              <X size={12} />
            </button>
          </li>
        ))}
      </ul>

      <form className="subtask-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a subtask..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          className="subtask-input"
        />
        <button type="submit" className="btn-icon btn-subtask-add" aria-label="Add subtask">
          <Plus size={14} />
        </button>
      </form>
    </div>
  );
}

export default SubtaskList;
