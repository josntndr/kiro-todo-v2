import { Activity, Plus, CheckCircle2, Edit3, Trash2, Archive, RotateCcw } from 'lucide-react';
import { formatActivityTime } from '../utils/taskUtils';

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
  created: 'activity-created',
  completed: 'activity-completed',
  edited: 'activity-edited',
  deleted: 'activity-deleted',
  archived: 'activity-archived',
  unarchived: 'activity-unarchived',
  uncompleted: 'activity-uncompleted',
};

function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-log">
        <h3 className="activity-log-title">
          <Activity size={18} />
          Activity Log
        </h3>
        <p className="activity-log-empty">No activity yet. Start by adding a task!</p>
      </div>
    );
  }

  return (
    <div className="activity-log">
      <h3 className="activity-log-title">
        <Activity size={18} />
        Activity Log
      </h3>
      <ul className="activity-log-list">
        {activities.slice(0, 20).map((entry) => {
          const Icon = ACTION_ICONS[entry.action] || Activity;
          const colorClass = ACTION_COLORS[entry.action] || '';
          return (
            <li key={entry.id} className={`activity-log-item ${colorClass}`}>
              <div className="activity-log-icon">
                <Icon size={14} />
              </div>
              <div className="activity-log-content">
                <span className="activity-log-action">
                  {entry.action === 'created' && 'Created'}
                  {entry.action === 'completed' && 'Completed'}
                  {entry.action === 'edited' && 'Edited'}
                  {entry.action === 'deleted' && 'Deleted'}
                  {entry.action === 'archived' && 'Archived'}
                  {entry.action === 'unarchived' && 'Unarchived'}
                  {entry.action === 'uncompleted' && 'Reopened'}
                </span>
                <span className="activity-log-task-title">{entry.taskTitle}</span>
                {entry.details && (
                  <span className="activity-log-details">{entry.details}</span>
                )}
              </div>
              <span className="activity-log-time">
                {formatActivityTime(entry.timestamp)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActivityLog;
