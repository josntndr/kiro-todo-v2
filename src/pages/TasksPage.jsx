import TaskForm from '../components/TaskForm';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import KanbanBoard from '../components/KanbanBoard';
import ViewToggle from '../components/ViewToggle';

function TasksPage({
  displayedTasks,
  editingTask,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  allTags,
  selectedTag,
  onTagChange,
  view,
  onViewChange,
  onAddOrUpdate,
  onCancelEdit,
  onEdit,
  onDelete,
  onToggleComplete,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  onReorder,
  onMoveTask,
  onArchive,
}) {
  return (
    <div className="page tasks-page">
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <p className="page-subtitle">Manage and organize your tasks</p>
      </div>

      <div className="tasks-layout">
        <aside className="tasks-sidebar">
          <TaskForm
            onSubmit={onAddOrUpdate}
            editingTask={editingTask}
            onCancelEdit={onCancelEdit}
          />
        </aside>

        <div className="tasks-main">
          <section className="task-controls">
            <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
            <div className="task-controls-row">
              <FilterBar
                filter={filter}
                onFilterChange={onFilterChange}
                sortBy={sortBy}
                onSortChange={onSortChange}
                tags={allTags}
                selectedTag={selectedTag}
                onTagChange={onTagChange}
              />
              <ViewToggle view={view} onViewChange={onViewChange} />
            </div>
          </section>

          {view === 'list' ? (
            <TaskList
              tasks={displayedTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
              onRemoveSubtask={onRemoveSubtask}
              onReorder={onReorder}
              onArchive={onArchive}
            />
          ) : (
            <KanbanBoard
              tasks={displayedTasks}
              onMoveTask={onMoveTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
