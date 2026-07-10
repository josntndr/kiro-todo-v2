import { useState, useEffect } from 'react';
import { Plus, Save, X, Trash2 } from 'lucide-react';
import { generateId } from '../utils/taskUtils';

function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('todo');
  const [recurrence, setRecurrence] = useState('none');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category || '');
      setStatus(editingTask.status || 'todo');
      setRecurrence(editingTask.recurrence || 'none');
      setSubtasks(editingTask.subtasks || []);
      setTags(editingTask.tags || []);
      setError('');
    }
  }, [editingTask]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setCategory('');
    setStatus('todo');
    setRecurrence('none');
    setSubtasks([]);
    setNewSubtask('');
    setTags([]);
    setNewTag('');
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      priority,
      category: category.trim() || null,
      status,
      recurrence,
      subtasks,
      tags,
    });

    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  function handleAddSubtask(e) {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: generateId(), title: newSubtask.trim(), completed: false },
    ]);
    setNewSubtask('');
  }

  function handleRemoveSubtask(id) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  function handleAddTag(e) {
    if (e) e.preventDefault();
    const tag = newTag.trim().toLowerCase();
    if (!tag || tags.includes(tag)) {
      setNewTag('');
      return;
    }
    setTags((prev) => [...prev, tag]);
    setNewTag('');
  }

  function handleRemoveTag(tag) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form-title">
        {editingTask ? 'Edit Task' : 'New Task'}
      </h2>

      <div className="form-row">
        <div className="form-group form-group-full">
          <label htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            className={error ? 'input-error' : ''}
          />
          {error && <span className="error-message">{error}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-full">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            placeholder="Add details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="form-row form-row-multi">
        <div className="form-group">
          <label htmlFor="task-due-date">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="form-row form-row-multi">
        <div className="form-group">
          <label htmlFor="task-category">Category</label>
          <input
            id="task-category"
            type="text"
            placeholder="e.g., Work"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-recurrence">Recurrence</label>
          <select
            id="task-recurrence"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="form-row">
        <div className="form-group form-group-full">
          <label>Tags</label>
          {tags.length > 0 && (
            <div className="form-tags-list">
              {tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button
                    type="button"
                    className="tag-chip-remove"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="form-subtask-add">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(e);
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddTag}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Subtask builder */}
      <div className="form-row">
        <div className="form-group form-group-full">
          <label>Subtasks</label>
          {subtasks.length > 0 && (
            <ul className="form-subtask-list">
              {subtasks.map((s) => (
                <li key={s.id} className="form-subtask-item">
                  <span>{s.title}</span>
                  <button
                    type="button"
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleRemoveSubtask(s.id)}
                    aria-label="Remove subtask"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="form-subtask-add">
            <input
              type="text"
              placeholder="Add a subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask(e);
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddSubtask}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTask ? <Save size={16} /> : <Plus size={16} />}
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            <X size={16} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
