import { List, Columns } from 'lucide-react';

function ViewToggle({ view, onViewChange }) {
  return (
    <div className="view-toggle">
      <button
        type="button"
        className={`btn-view ${view === 'list' ? 'active' : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
        title="List view"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        className={`btn-view ${view === 'kanban' ? 'active' : ''}`}
        onClick={() => onViewChange('kanban')}
        aria-label="Kanban view"
        title="Kanban view"
      >
        <Columns size={18} />
      </button>
    </div>
  );
}

export default ViewToggle;
