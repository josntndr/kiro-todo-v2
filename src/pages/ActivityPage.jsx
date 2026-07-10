import { Activity, Trash2 } from 'lucide-react';
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

function ActivityPage({ activities, onClearActivities }) {
  return (
    <div className="page activity-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity Log</h1>
          <p className="page-subtitle">Track all changes to your tasks</p>
        </div>
        {activities.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClearActivities}
          >
            <Trash2 size={14} />
            Clear History
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="empty-state">
          <Activity size={48} className="empty-state-icon" />
          <h3>No activity yet</h3>
          <p>Your task activity history will appear here.</p>
        </div>
      ) : (
        <div className="activity-full-list">
          {activities.map((entry) => (
            <div key={entry.id} className={`activity-full-item activity-${entry.action}`}>
              <div className="activity-full-dot" />
              <div className="activity-full-content">
                <div className="activity-full-header">
                  <span className="activity-full-action">
                    {ACTION_LABELS[entry.action] || entry.action}
                  </span>
                  <span className="activity-full-time">
                    {formatActivityTime(entry.timestamp)}
                  </span>
                </div>
                <span className="activity-full-task">{entry.taskTitle}</span>
                {entry.details && (
                  <span className="activity-full-details">{entry.details}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityPage;
