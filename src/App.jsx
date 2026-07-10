import { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CheckCheck, Undo2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import TasksPage from './pages/TasksPage';
import DashboardPage from './pages/DashboardPage';
import PomodoroPage from './pages/PomodoroPage';
import ActivityPage from './pages/ActivityPage';
import ArchivePage from './pages/ArchivePage';
import SettingsPage from './pages/SettingsPage';
import {
  generateId,
  filterTasks,
  sortTasks,
  searchTasks,
  migrateTasks,
  calculateNextDueDate,
  getAllTags,
  filterByTag,
  createActivityEntry,
} from './utils/taskUtils';

const STORAGE_KEY = 'tasks';
const THEME_KEY = 'theme';
const ACTIVITY_KEY = 'activity_log';

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return migrateTasks(parsed);
  } catch {
    return [];
  }
}

function loadActivities() {
  try {
    const data = localStorage.getItem(ACTIVITY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function saveActivities(activities) {
  const trimmed = activities.slice(0, 100);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(trimmed));
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [activities, setActivities] = useState(loadActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('manual');
  const [selectedTag, setSelectedTag] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);
  const [view, setView] = useState('list');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [deletedTask, setDeletedTask] = useState(null);
  const undoTimerRef = useRef(null);

  // Persist tasks
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Persist activities
  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Toast auto-dismiss (but not for undo toasts)
  useEffect(() => {
    if (toast && !toast.undoable) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || tag === 'select';

      if (e.key === 'Escape') {
        if (showShortcuts) setShowShortcuts(false);
        else if (editingTask) handleCancelEdit();
        return;
      }

      if (isInput) return;

      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
        e.preventDefault();
        const searchEl = document.querySelector('.search-bar input');
        if (searchEl) searchEl.focus();
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        const titleEl = document.getElementById('task-title');
        if (titleEl) titleEl.focus();
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setView((prev) => (prev === 'list' ? 'kanban' : 'list'));
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, editingTask]);

  function addActivity(action, taskTitle, details = '') {
    const entry = createActivityEntry(action, taskTitle, details);
    setActivities((prev) => [entry, ...prev]);
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  // CRUD operations
  const handleAddOrUpdate = useCallback(
    (taskData) => {
      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? { ...t, ...taskData, completed: taskData.status === 'done' }
              : t
          )
        );
        setEditingTask(null);
        addActivity('edited', taskData.title);
        showToast('Task updated successfully!');
      } else {
        const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.order ?? 0)) : -1;
        const newTask = {
          id: generateId(),
          ...taskData,
          completed: taskData.status === 'done',
          createdAt: new Date().toISOString(),
          order: maxOrder + 1,
          status: taskData.status || 'todo',
          subtasks: taskData.subtasks || [],
          recurrence: taskData.recurrence || 'none',
          tags: taskData.tags || [],
          archived: false,
        };
        setTasks((prev) => [newTask, ...prev]);
        addActivity('created', taskData.title);
        showToast('Task added successfully!');
      }
    },
    [editingTask, tasks]
  );

  // Undo Delete
  function handleDelete(id) {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeletedTask(taskToDelete);

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    setToast({
      message: `"${taskToDelete.title}" deleted.`,
      type: 'info',
      undoable: true,
    });

    undoTimerRef.current = setTimeout(() => {
      setDeletedTask(null);
      setToast(null);
      addActivity('deleted', taskToDelete.title);
    }, 5000);
  }

  function handleUndo() {
    if (!deletedTask) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setTasks((prev) => [deletedTask, ...prev]);
    setDeletedTask(null);
    setToast({ message: 'Task restored!', type: 'success' });
  }

  function handleToggleComplete(id) {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== id) return t;
        const newCompleted = !t.completed;
        const newStatus = newCompleted ? 'done' : 'todo';
        return { ...t, completed: newCompleted, status: newStatus };
      });

      const task = updated.find((t) => t.id === id);
      if (task && task.completed && task.recurrence && task.recurrence !== 'none') {
        const nextDueDate = calculateNextDueDate(task.dueDate, task.recurrence);
        const maxOrder = updated.length > 0 ? Math.max(...updated.map((t) => t.order ?? 0)) : 0;
        const nextTask = {
          id: generateId(),
          title: task.title,
          description: task.description,
          dueDate: nextDueDate,
          priority: task.priority,
          category: task.category,
          completed: false,
          createdAt: new Date().toISOString(),
          order: maxOrder + 1,
          status: 'todo',
          subtasks: (task.subtasks || []).map((s) => ({ ...s, completed: false })),
          recurrence: task.recurrence,
          tags: task.tags || [],
          archived: false,
        };
        addActivity('completed', task.title, `Next: ${nextDueDate}`);
        showToast(`Task completed! Next occurrence: ${nextDueDate}`, 'success');
        return [...updated, nextTask];
      }

      if (task.completed) {
        addActivity('completed', task.title);
      } else {
        addActivity('uncompleted', task.title);
      }
      showToast(task.completed ? 'Task marked as completed!' : 'Task marked as pending.');
      return updated;
    });
  }

  function handleEdit(task) {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  // Archive handlers
  function handleArchive(id) {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, archived: true } : t))
    );
    if (task) {
      addActivity('archived', task.title);
      showToast(`"${task.title}" archived.`, 'info');
    }
  }

  function handleUnarchive(id) {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, archived: false } : t))
    );
    if (task) {
      addActivity('unarchived', task.title);
      showToast(`"${task.title}" restored from archive.`);
    }
  }

  // Subtask handlers
  function handleToggleSubtask(taskId, subtaskId) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = (t.subtasks || []).map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
  }

  function handleAddSubtask(taskId, subtask) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, subtasks: [...(t.subtasks || []), subtask] };
      })
    );
  }

  function handleRemoveSubtask(taskId, subtaskId) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId) };
      })
    );
  }

  // Drag-and-drop reorder
  function handleReorder(reorderedTasks) {
    const updatedWithOrder = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTasks((prev) => {
      const displayedIds = new Set(updatedWithOrder.map((t) => t.id));
      const remaining = prev.filter((t) => !displayedIds.has(t.id));
      return [...updatedWithOrder, ...remaining];
    });

    if (sortBy !== 'manual') {
      setSortBy('manual');
    }
  }

  // Kanban move task between columns
  function handleMoveTask(taskId, newStatus) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const completed = newStatus === 'done';
        return { ...t, status: newStatus, completed };
      })
    );
  }

  // Import handler
  function handleImport(importedTasks, mode) {
    if (mode === 'replace') {
      setTasks(importedTasks);
    } else {
      setTasks((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTasks = importedTasks.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newTasks];
      });
    }
  }

  // Clear activity log
  function handleClearActivities() {
    setActivities([]);
    localStorage.removeItem(ACTIVITY_KEY);
    showToast('Activity history cleared.', 'info');
  }

  // Computed data
  const activeTasks = tasks.filter((t) => !t.archived);
  const archivedTasks = tasks.filter((t) => t.archived);
  const allTags = getAllTags(activeTasks);

  let displayedTasks = sortTasks(
    filterTasks(searchTasks(activeTasks, searchQuery), filter),
    sortBy
  );

  if (selectedTag) {
    displayedTasks = filterByTag(displayedTasks, selectedTag);
  }

  return (
    <div className="app-layout">
      {/* Toast with undo support */}
      {toast && (
        <div className={`toast toast-${toast.type}`} role="alert">
          <CheckCheck size={16} />
          <span className="toast-message">{toast.message}</span>
          {toast.undoable && deletedTask && (
            <button
              type="button"
              className="btn btn-undo"
              onClick={handleUndo}
            >
              <Undo2 size={14} />
              Undo
            </button>
          )}
        </div>
      )}

      <Sidebar archivedCount={archivedTasks.length} />

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route
            path="/tasks"
            element={
              <TasksPage
                displayedTasks={displayedTasks}
                editingTask={editingTask}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filter={filter}
                onFilterChange={setFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                allTags={allTags}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
                view={view}
                onViewChange={setView}
                onAddOrUpdate={handleAddOrUpdate}
                onCancelEdit={handleCancelEdit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                onToggleSubtask={handleToggleSubtask}
                onAddSubtask={handleAddSubtask}
                onRemoveSubtask={handleRemoveSubtask}
                onReorder={handleReorder}
                onMoveTask={handleMoveTask}
                onArchive={handleArchive}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<DashboardPage tasks={activeTasks} />}
          />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route
            path="/activity"
            element={
              <ActivityPage
                activities={activities}
                onClearActivities={handleClearActivities}
              />
            }
          />
          <Route
            path="/archive"
            element={
              <ArchivePage
                archivedTasks={archivedTasks}
                onUnarchive={handleUnarchive}
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                theme={theme}
                onToggleTheme={toggleTheme}
                tasks={tasks}
                onImport={handleImport}
                showToast={showToast}
              />
            }
          />
        </Routes>
      </main>

      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}

export default App;
