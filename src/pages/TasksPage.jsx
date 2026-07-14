import TaskForm from '../components/TaskForm';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import KanbanBoard from '../components/KanbanBoard';
import DashboardSummary from '../components/DashboardSummary';
import './TasksPage.css';

function TasksPage({
  tasks,
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
    <div className="tasks-page-container">
      <section className="tasks-header">
        <h1>Tasks</h1>
        <p>Manage and organize your tasks</p>
      </section>

      <section className="tasks-stats">
        <DashboardSummary tasks={tasks} />
      </section>

      <div className="tasks-workspace">
        <div className="tasks-workspace-left">
          <h2>Create New Task</h2>
          <p>Add the details for your next task.</p>
          <TaskForm
            onSubmit={onAddOrUpdate}
            editingTask={editingTask}
            onCancelEdit={onCancelEdit}
          />
        </div>

        <div className="tasks-workspace-right">
          <h2>Your Tasks</h2>
          <p>View, organize, and update your tasks.</p>

          <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

          <FilterBar
            filter={filter}
            onFilterChange={onFilterChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            tags={allTags}
            selectedTag={selectedTag}
            onTagChange={onTagChange}
            searchQuery={searchQuery}
            onSearchClear={() => onSearchChange('')}
            view={view}
            onViewChange={onViewChange}
            taskCount={displayedTasks.length}
          />

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
