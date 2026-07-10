import { Archive, RotateCcw, Trash2, Calendar, Tag } from 'lucide-react';

function ArchivePage({ archivedTasks, onUnarchive, onDelete }) {
  return (
    <div className="page archive-page">
      <div className="page-header">
        <h1 className="page-title">Archive</h1>
        <p className="page-subtitle">
          {archivedTasks.length} archived task{archivedTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {archivedTasks.length === 0 ? (
        <div className="empty-state">
          <Archive size={48} className="empty-state-icon" />
          <h3>No archived tasks</h3>
          <p>Completed or dismissed tasks you archive will appear here.</p>
        </div>
      ) : (
        <div className="archive-list">
          {archivedTasks.map((task) => (
            <div key={task.id} className="archive-card">
              <div className="archive-card-content">
                <h3 className="archive-card-title">{task.title}</h3>
                {task.description && (
                  <p className="archive-card-description">{task.description}</p>
                )}
                <div className="archive-card-meta">
                  {task.dueDate && (
                    <span className="meta-item">
                      <Calendar size={13} />
                      {task.dueDate}
                    </span>
                  )}
                  {task.category && (
                    <span className="meta-item meta-category">
                      <Tag size={13} />
                      {task.category}
                    </span>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div className="archive-card-tags">
                      {task.tags.map((tag) => (
                        <span key={tag} className="tag-chip tag-chip-small">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="archive-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onUnarchive(task.id)}
                  title="Restore task"
                >
                  <RotateCcw size={14} />
                  Restore
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(task.id)}
                  title="Permanently delete"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchivePage;
