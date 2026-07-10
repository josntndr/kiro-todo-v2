import { BarChart3 } from 'lucide-react';
import { getCategoryProgress } from '../utils/taskUtils';

function CategoryProgress({ tasks }) {
  const progress = getCategoryProgress(tasks);

  if (progress.length === 0) {
    return null;
  }

  return (
    <div className="category-progress">
      <h3 className="category-progress-title">
        <BarChart3 size={18} />
        Category Progress
      </h3>
      <div className="category-progress-list">
        {progress.map((cat) => (
          <div key={cat.name} className="category-progress-item">
            <div className="category-progress-header">
              <span className="category-progress-name">{cat.name}</span>
              <span className="category-progress-stats">
                {cat.completed}/{cat.total} ({cat.percentage}%)
              </span>
            </div>
            <div className="category-progress-bar-bg">
              <div
                className="category-progress-bar-fill"
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryProgress;
