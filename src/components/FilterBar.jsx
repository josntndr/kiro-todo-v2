import {
  Circle,
  LoaderCircle,
  CircleCheck,
  TriangleAlert,
  CalendarDays,
  CalendarRange,
  Flag,
  FilterX,
  ArrowUpDown,
  List,
  Columns3,
} from 'lucide-react';

const STATUS_FILTERS = [
  { value: 'all', label: 'All', icon: Circle },
  { value: 'pending', label: 'To Do', icon: Circle },
  { value: 'in-progress', label: 'In Progress', icon: LoaderCircle },
  { value: 'completed', label: 'Done', icon: CircleCheck },
  { value: 'overdue', label: 'Overdue', icon: TriangleAlert },
];

const OTHER_FILTERS = [
  { value: 'due-today', label: 'Due Today', icon: CalendarDays },
  { value: 'due-week', label: 'This Week', icon: CalendarRange },
  { value: 'high', label: 'High Priority', icon: Flag },
];

function FilterBar({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  tags,
  selectedTag,
  onTagChange,
  searchQuery,
  onSearchClear,
  view,
  onViewChange,
  taskCount,
}) {
  const isDefault = filter === 'all' && sortBy === 'manual' && !selectedTag && !searchQuery;

  function handleClearAll() {
    onFilterChange('all');
    if (onSearchClear) onSearchClear();
    if (selectedTag) onTagChange(null);
    onSortChange('manual');
  }

  const taskCountText =
    taskCount === 0
      ? 'No tasks'
      : taskCount === 1
      ? '1 task'
      : `${taskCount} tasks`;

  return (
    <div className="filter-toolbar">
      {/* Status Filters */}
      <div className="filter-group">
        <span className="filter-group-label">Status</span>
        <div className="filter-pills">
          {STATUS_FILTERS.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                className={`filter-pill ${isActive ? 'filter-pill--active' : ''}`}
                onClick={() => onFilterChange(f.value)}
                aria-pressed={isActive}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Filters */}
      <div className="filter-group">
        <span className="filter-group-label">Other filters</span>
        <div className="filter-pills">
          {OTHER_FILTERS.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                className={`filter-pill ${isActive ? 'filter-pill--active' : ''}`}
                onClick={() => onFilterChange(f.value)}
                aria-pressed={isActive}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{f.label}</span>
              </button>
            );
          })}
          {!isDefault && (
            <button
              type="button"
              className="filter-pill filter-pill--clear"
              onClick={handleClearAll}
              aria-label="Clear all filters"
            >
              <FilterX size={14} aria-hidden="true" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Tags filter */}
      {tags && tags.length > 0 && (
        <div className="filter-group filter-group--inline">
          <span className="filter-group-label">Tag</span>
          <select
            className="filter-select"
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

      {/* Divider */}
      <div className="filter-divider" aria-hidden="true" />

      {/* Controls */}
      <div className="filter-controls-row">
        <div className="filter-controls-left">
          <span className="filter-controls-label">Sort by</span>
          <div className="filter-sort-group">
            <ArrowUpDown size={15} className="filter-sort-icon" aria-hidden="true" />
            <select
              className="filter-select"
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

        <div className="filter-controls-right">
          <div className="filter-view-toggle">
            <button
              type="button"
              className={`filter-view-btn ${view === 'list' ? 'filter-view-btn--active' : ''}`}
              onClick={() => onViewChange('list')}
              aria-pressed={view === 'list'}
              aria-label="Show list view"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className={`filter-view-btn ${view === 'kanban' ? 'filter-view-btn--active' : ''}`}
              onClick={() => onViewChange('kanban')}
              aria-pressed={view === 'kanban'}
              aria-label="Show board view"
            >
              <Columns3 size={16} />
            </button>
          </div>
          <span className="filter-task-count">{taskCountText}</span>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
