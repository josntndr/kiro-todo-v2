import { ArrowUpDown } from 'lucide-react';

function FilterBar({ filter, onFilterChange, sortBy, onSortChange, tags, selectedTag, onTagChange }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Done' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'due-today', label: 'Due Today' },
    { value: 'due-week', label: 'This Week' },
    { value: 'high', label: 'High Priority' },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`btn btn-filter ${filter === f.value ? 'active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="filter-bar-controls">
        {tags && tags.length > 0 && (
          <div className="tag-filter-control">
            <select
              value={selectedTag || ''}
              onChange={(e) => onTagChange(e.target.value || null)}
              aria-label="Filter by tag"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sort-control">
          <ArrowUpDown size={16} />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort tasks"
          >
            <option value="manual">Manual</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
