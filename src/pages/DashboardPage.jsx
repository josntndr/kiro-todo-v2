import DashboardSummary from '../components/DashboardSummary';
import CategoryProgress from '../components/CategoryProgress';
import { getTaskStats } from '../utils/taskUtils';

function DashboardPage({ tasks }) {
  const stats = getTaskStats(tasks);
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your productivity</p>
      </div>

      <DashboardSummary tasks={tasks} />

      <div className="dashboard-details">
        <div className="dashboard-completion-card">
          <h3>Overall Completion</h3>
          <div className="completion-ring-container">
            <svg className="completion-ring" viewBox="0 0 120 120">
              <circle
                className="completion-ring-bg"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="10"
              />
              <circle
                className="completion-ring-fill"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - completionRate / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="completion-ring-text">
              <span className="completion-ring-value">{completionRate}%</span>
              <span className="completion-ring-label">Complete</span>
            </div>
          </div>
        </div>

        <CategoryProgress tasks={tasks} />
      </div>
    </div>
  );
}

export default DashboardPage;
