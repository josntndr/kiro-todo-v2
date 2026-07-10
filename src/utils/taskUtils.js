export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Migrate old tasks to include new fields with sensible defaults
export function migrateTask(task, index) {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate || null,
    priority: task.priority || 'Medium',
    category: task.category || null,
    completed: task.completed || false,
    createdAt: task.createdAt || new Date().toISOString(),
    order: task.order !== undefined ? task.order : index,
    status: task.status || (task.completed ? 'done' : 'todo'),
    subtasks: task.subtasks || [],
    recurrence: task.recurrence || 'none',
    tags: task.tags || [],
    archived: task.archived || false,
  };
}

export function migrateTasks(tasks) {
  return tasks.map((task, index) => migrateTask(task, index));
}

export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + 'T00:00:00');
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => isOverdue(t)).length;
  return { total, completed, pending, overdue };
}

export function filterTasks(tasks, filter) {
  switch (filter) {
    case 'pending':
      return tasks.filter((t) => !t.completed);
    case 'in-progress':
      return tasks.filter((t) => t.status === 'in-progress');
    case 'completed':
      return tasks.filter((t) => t.completed);
    case 'overdue':
      return tasks.filter((t) => isOverdue(t));
    case 'high':
      return tasks.filter((t) => t.priority === 'High');
    case 'due-today':
      return tasks.filter((t) => isDueToday(t));
    case 'due-week':
      return tasks.filter((t) => isDueThisWeek(t));
    default:
      return tasks;
  }
}

export function sortTasks(tasks, sortBy) {
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  const sorted = [...tasks];

  switch (sortBy) {
    case 'manual':
      return sorted.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'priority':
      return sorted.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    default:
      return sorted;
  }
}

export function searchTasks(tasks, query) {
  if (!query.trim()) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
  );
}

// Calculate next due date based on recurrence type
export function calculateNextDueDate(currentDueDate, recurrence) {
  const base = currentDueDate ? new Date(currentDueDate + 'T00:00:00') : new Date();
  base.setHours(0, 0, 0, 0);

  switch (recurrence) {
    case 'daily':
      base.setDate(base.getDate() + 1);
      break;
    case 'weekly':
      base.setDate(base.getDate() + 7);
      break;
    case 'monthly':
      base.setMonth(base.getMonth() + 1);
      break;
    default:
      return null;
  }

  // Return as YYYY-MM-DD string
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Export tasks as JSON string
export function exportTasksAsJSON(tasks) {
  return JSON.stringify(tasks, null, 2);
}

// Export tasks as CSV string
export function exportTasksAsCSV(tasks) {
  const headers = [
    'id', 'title', 'description', 'dueDate', 'priority',
    'category', 'completed', 'createdAt', 'order', 'status',
    'recurrence', 'subtasks'
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = tasks.map((task) => {
    const subtaskStr = (task.subtasks || [])
      .map((s) => `${s.completed ? '[x]' : '[ ]'} ${s.title}`)
      .join('; ');

    return [
      escapeCSV(task.id),
      escapeCSV(task.title),
      escapeCSV(task.description),
      escapeCSV(task.dueDate),
      escapeCSV(task.priority),
      escapeCSV(task.category),
      escapeCSV(task.completed),
      escapeCSV(task.createdAt),
      escapeCSV(task.order),
      escapeCSV(task.status),
      escapeCSV(task.recurrence),
      escapeCSV(subtaskStr),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

// Validate imported tasks
export function validateImportedTasks(data) {
  if (!Array.isArray(data)) return { valid: false, error: 'Data must be an array of tasks.' };

  for (let i = 0; i < data.length; i++) {
    const task = data[i];
    if (!task.title || typeof task.title !== 'string') {
      return { valid: false, error: `Task at index ${i} is missing a valid title.` };
    }
  }

  return { valid: true, error: null };
}

// Download a file with given content
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// --- Due Date Helpers ---

export function isDueToday(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return task.dueDate === todayStr;
}

export function isDueThisWeek(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  const due = new Date(task.dueDate + 'T00:00:00');
  return due >= today && due <= endOfWeek;
}

// --- Activity Log Helpers ---

export function createActivityEntry(action, taskTitle, details = '') {
  return {
    id: generateId(),
    action,
    taskTitle,
    details,
    timestamp: new Date().toISOString(),
  };
}

export function formatActivityTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// --- Tag Helpers ---

export function getAllTags(tasks) {
  const tagSet = new Set();
  tasks.forEach((task) => {
    if (task.tags && Array.isArray(task.tags)) {
      task.tags.forEach((tag) => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
}

export function filterByTag(tasks, tag) {
  if (!tag) return tasks;
  return tasks.filter((t) => t.tags && t.tags.includes(tag));
}

// --- Category Progress ---

export function getCategoryProgress(tasks) {
  const categories = {};
  tasks.forEach((task) => {
    const cat = task.category || 'Uncategorized';
    if (!categories[cat]) {
      categories[cat] = { total: 0, completed: 0 };
    }
    categories[cat].total++;
    if (task.completed) categories[cat].completed++;
  });
  return Object.entries(categories).map(([name, data]) => ({
    name,
    total: data.total,
    completed: data.completed,
    percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }));
}
