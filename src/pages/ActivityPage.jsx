import { Activity, Trash2, Plus, CheckCircle2, Edit3, Archive, RotateCcw } from 'lucide-react';
import { formatActivityTime } from '../utils/taskUtils';

const ACTION_LABELS = {
  created: 'Created',
  completed: 'Completed',
  edited: 'Edited',
  deleted: 'Deleted',
  archived: 'Archived',
  unarchived: 'Unarchived',
  uncompleted: 'Reopened',
};

const ACTION_ICONS = {
  created: Plus,
  completed: CheckCircle2,
  edited: Edit3,
  deleted: Trash2,
  archived: Archive,
  unarchived: RotateCcw,
  uncompleted: RotateCcw,
};

const ACTION_COLORS = {
  created: '#3b82f6',
  completed: '#22c55e',
  edited: '#f59e0b',
  deleted: '#ef4444',
  archived: '#94a3b8',
  unarchived: '#3b82f6',
  uncompleted: '#f59e0b',
};

function getDateGroup(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekAgo) return 'This Week';
  return 'Older';
}

function groupActivitiesByDate(activities) {
  const groups = {};
  const order = ['Today', 'Yesterday', 'This Week', 'Older'];

  for (const activity of activities) {
    const group = getDateGroup(activity.timestamp);
    if (!groups[group]) groups[group] = [];
    groups[group].push(activity);
  }

  return order.filter((g) => groups[g]).map((g) => ({ label: g, items: groups[g] }));
}

function ActivityPage({ activities, onClearActivities }) {
  const grouped = groupActivitiesByDate(activities);

  return (
    <div className="page activity-page" style={{ padding: '24px 20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            margin: 0,
          }}>
            Activity Log
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            margin: '4px 0 0',
          }}>
            Track all changes to your tasks
          </p>
        </div>
        {activities.length > 0 && (
          <button
            type="button"
            onClick={onClearActivities}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Trash2 size={14} />
            Clear History
          </button>
        )}
      </div>

      {/* Content */}
      {activities.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          gap: '16px',
        }}>
          <Activity size={64} style={{ color: 'var(--color-border)' }} />
          <h3 style={{ color: 'var(--color-text)', fontSize: '1.2rem', margin: 0 }}>
            No activity yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
            Your task activity history will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {grouped.map((group) => (
            <div key={group.label}>
              {/* Group Label */}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '14px',
              }}>
                {group.label}
              </div>

              {/* Timeline */}
              <div style={{
                borderLeft: '2px solid var(--color-border)',
                marginLeft: '11px',
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                {group.items.map((entry) => {
                  const Icon = ACTION_ICONS[entry.action] || Activity;
                  const color = ACTION_COLORS[entry.action] || '#94a3b8';
                  return (
                    <div
                      key={entry.id}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 0',
                      }}
                    >
                      {/* Dot on timeline */}
                      <div style={{
                        position: 'absolute',
                        left: '-27px',
                        top: '14px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: color,
                        border: '2px solid var(--color-bg)',
                      }} />

                      {/* Icon */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={16} style={{ color }} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontWeight: 600,
                            color: 'var(--color-text)',
                            fontSize: '0.85rem',
                          }}>
                            {ACTION_LABELS[entry.action] || entry.action}
                          </span>
                          <span style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {entry.taskTitle}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '3px',
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                          }}>
                            {formatActivityTime(entry.timestamp)}
                          </span>
                          {entry.details && (
                            <span style={{
                              fontSize: '0.75rem',
                              color: 'var(--color-text-muted)',
                              fontStyle: 'italic',
                            }}>
                              • {entry.details}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityPage;
