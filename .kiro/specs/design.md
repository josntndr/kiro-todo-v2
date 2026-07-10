# Design: Task Manager App

## Architecture
Single-page React application with client-side state management (useState/useEffect). No routing needed. All data persisted in localStorage.

## Data Model

### Task Object
```json
{
  "id": "string (uuid)",
  "title": "string (required)",
  "description": "string (optional)",
  "dueDate": "string|null (ISO date, optional)",
  "priority": "Low|Medium|High (default: Medium)",
  "category": "string (optional)",
  "completed": "boolean (default: false)",
  "createdAt": "string (ISO timestamp)"
}
```

### localStorage Key
- Key: `"tasks"`
- Value: JSON array of Task objects

## Component Architecture

```
App.jsx
├── DashboardSummary.jsx        — Summary cards (Total, Completed, Pending, Overdue)
├── TaskForm.jsx                — Add/Edit form with validation
├── SearchBar.jsx               — Search input
├── FilterBar.jsx               — Filter buttons + Sort dropdown
├── TaskList.jsx                — List container with empty state
│   └── TaskCard.jsx            — Individual task display with actions
└── Toast (inline notification) — Feedback messages
```

## Component Responsibilities

### App.jsx
- Holds all state: tasks[], searchQuery, filter, sortBy, editingTask, toast
- Handles CRUD operations
- Manages localStorage sync via useEffect
- Passes data and handlers to children

### DashboardSummary.jsx
- Props: tasks[]
- Computes and displays: total, completed, pending, overdue counts
- 4 colored cards in a responsive grid

### TaskForm.jsx
- Props: onSubmit, editingTask, onCancelEdit
- Controlled form with title, description, dueDate, priority, category
- Validation: title required, shows inline error
- Submit adds new task or updates existing (based on editingTask prop)

### SearchBar.jsx
- Props: searchQuery, onSearchChange
- Controlled text input with search icon

### FilterBar.jsx
- Props: filter, onFilterChange, sortBy, onSortChange
- Row of filter buttons (All, Pending, Completed, Overdue, High Priority)
- Sort dropdown (Newest, Oldest, Due Date, Priority)

### TaskList.jsx
- Props: tasks[] (already filtered/sorted), onEdit, onDelete, onToggleComplete
- Maps tasks to TaskCard components
- Shows empty state when tasks[] is empty

### TaskCard.jsx
- Props: task, onEdit, onDelete, onToggleComplete
- Displays task info with priority badge, category tag, due date
- Completed tasks: muted style, strikethrough title
- Overdue tasks: red/orange accent
- Action buttons: edit, delete, toggle complete
- Delete shows confirmation inline or via confirm()

### src/utils/taskUtils.js
- generateId(): creates unique IDs
- filterTasks(tasks, filter): applies filter logic
- sortTasks(tasks, sortBy): applies sort logic
- searchTasks(tasks, query): searches title, description, category
- isOverdue(task): checks if task is past due and not completed
- getTaskStats(tasks): returns {total, completed, pending, overdue}

## Styling Approach
- Single CSS file: src/App.css
- CSS custom properties for colors, spacing, radii
- Mobile-first responsive design with media queries
- Color palette: soft blues, greens, warm accents
- Cards: white background, subtle shadow, rounded corners (12px)
- Priority colors: High=#ef4444, Medium=#f59e0b, Low=#22c55e
- Completed tasks: opacity 0.7, strikethrough title
- Overdue tasks: left border or background tint in red/orange

## User Feedback
- Toast notifications appear at top-right
- Auto-dismiss after 3 seconds
- Types: success (green), info (blue), error (red)

## Responsive Breakpoints
- Desktop: >1024px — multi-column layout
- Tablet: 768–1024px — 2-column grid for cards
- Mobile: <768px — single column, stacked layout
