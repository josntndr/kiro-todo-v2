import { CheckCircle2, Clock, AlertTriangle, ListTodo, Flame } from 'lucide-react';
import { getTaskStats } from '../utils/taskUtils';

function DashboardSummary({ tasks }) {
  const safeTasks = tasks || [];
  const stats = getTaskStats(safeTasks);
  const highPriority = safeTasks.filter((t) => t.priority === 'High' && !t.completed).length;

  return (
    <div className="dashboard-summary">
      <div className="summary-card card-total">
        <div className="summary-card-icon">
          <ListTodo size={22} />
        </div>
        <div className="summary-card-info">
          <span className="summary-card-value">{stats.total}</span>
          <span className="summary-card-label">Total</span>
        </div>
      </div>

      <div className="summary-card card-completed">
        <div className="summary-card-icon">
          <CheckCircle2 size={22} />
        </div>
        <div className="summary-card-info">
          <span className="summary-card-value">{stats.completed}</span>
          <span className="summary-card-label">Done</span>
        </div>
      </div>

      <div className="summary-card card-pending">
        <div className="summary-card-icon">
          <Clock size={22} />
        </div>
        <div className="summary-card-info">
          <span className="summary-card-value">{stats.pending}</span>
          <span className="summary-card-label">Pending</span>
        </div>
      </div>

      <div className="summary-card card-overdue">
        <div className="summary-card-icon">
          <AlertTriangle size={22} />
        </div>
        <div className="summary-card-info">
          <span className="summary-card-value">{stats.overdue}</span>
          <span className="summary-card-label">Overdue</span>
        </div>
      </div>

      <div className="summary-card card-high">
        <div className="summary-card-icon">
          <Flame size={22} />
        </div>
        <div className="summary-card-info">
          <span className="summary-card-value">{highPriority}</span>
          <span className="summary-card-label">High Priority</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardSummary;
