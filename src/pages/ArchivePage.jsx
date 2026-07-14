import { Archive, RotateCcw, Trash2, Calendar, Tag, Inbox } from 'lucide-react';

function ArchivePage({ archivedTasks, onUnarchive, onDelete }) {
  return (
    <div className="page archive-page" style={{ padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          Archive
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          margin: '4px 0 0',
        }}>
          {archivedTasks.length} archived task{archivedTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content */}
      {archivedTasks.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          gap: '16px',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Archive size={64} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <h3 style={{ color: 'var(--color-text)', fontSize: '1.2rem', margin: 0 }}>
            No archived tasks
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0, textAlign: 'center', maxWidth: '300px' }}>
            Completed or dismissed tasks you archive will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {archivedTasks.map((task) => (
            <div
              key={task.id}
              style={{
                background: 'var(--color-surface)',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Task Content */}
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: '0 0 6px',
                }}>
                  {task.title}
                </h3>
                {task.description && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {task.description}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '14px',
              }}>
                {task.dueDate && (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <Calendar size={13} />
                    {task.dueDate}
                  </span>
                )}
                {task.category && (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <Tag size={13} />
                    {task.category}
                  </span>
                )}
                {task.tags && task.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: 'var(--color-primary-subtle)',
                          border: '1px solid var(--color-primary-glow)',
                          color: 'var(--color-primary-light)',
                          fontSize: '0.7rem',
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '12px',
              }}>
                <button
                  type="button"
                  onClick={() => onUnarchive(task.id)}
                  title="Restore task"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-primary-glow)',
                    background: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <RotateCcw size={14} />
                  Restore
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  title="Permanently delete"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-danger-subtle)',
                    background: 'var(--color-danger-subtle)',
                    color: 'var(--color-danger)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Trash2 size={13} />
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
