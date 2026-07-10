# Requirements: Task Manager Enhancement

## Overview
A modern, responsive, portfolio-ready productivity web application built with React + Vite that enables users to organize, track, search, filter, and manage their daily tasks easily.

## Tech Stack
- React 18 + Vite
- localStorage for data persistence
- lucide-react for icons
- CSS (no UI framework — custom styling)
- No backend

## Functional Requirements

### FR-01: Add Task
- User can create a new task with title, description, due date, priority, and category.
- Task title is required; empty titles show an error message.
- Due date is optional.
- Priority defaults to "Medium" (options: Low, Medium, High).
- Category/tag is optional.
- Task is immediately displayed and saved to localStorage.

### FR-02: Edit Task
- User can edit any existing task's fields.
- Updates are applied in-place without creating duplicates.
- Changes are persisted to localStorage.

### FR-03: Delete Task
- User can delete a task.
- A confirmation dialog is shown before deletion.
- On confirmation, the task is removed and localStorage is updated.

### FR-04: Mark Task Complete/Pending
- User can toggle a task between "completed" and "pending" status.
- Visual style changes to reflect the current status.

### FR-05: Persistence via localStorage
- All tasks are saved to localStorage on every change.
- On page load/refresh, tasks are restored from localStorage.

### FR-06: Due Date
- Each task may optionally have a due date.
- Overdue tasks (past due date + not completed) are visually highlighted.

### FR-07: Priority Level
- Each task has a priority: Low, Medium, or High.
- Priority is displayed on the task card with visual differentiation.

### FR-08: Category/Tag
- Each task may optionally have a category/tag.
- Category is searchable and displayed on the card.

### FR-09: Search
- User can search tasks by title, description, or category.
- Results update in real-time as the user types.

### FR-10: Filter
- Filters: All, Pending, Completed, Overdue, High Priority.
- Only matching tasks are displayed.

### FR-11: Sort
- Sort options: Newest, Oldest, Due Date, Priority.
- Task list reorders according to selected sort option.

### FR-12: Dashboard Summary
- Summary cards displaying: Total Tasks, Completed, Pending, Overdue counts.
- Updates dynamically as tasks change.

### FR-13: Empty States
- When no tasks exist or no tasks match filters/search, show a friendly empty state message with an icon.

### FR-14: Delete Confirmation
- A modal or inline confirmation is shown before permanently deleting a task.

### FR-15: User Feedback
- Toast/notification messages when a task is added, updated, completed, or deleted.

## Non-Functional Requirements

### NFR-01: Responsive Design
- Layout works on desktop (>1024px), tablet (768–1024px), and mobile (<768px).

### NFR-02: Modern UI/UX
- Soft colors, rounded cards, readable text.
- Consistent spacing, font sizes, colors, and button styles.
- Hover, active, and focus states on interactive elements.
- Completed tasks visually different (e.g., strikethrough, muted).
- Overdue tasks visually highlighted (e.g., red accent).
- Icons from lucide-react used where appropriate.

### NFR-03: Code Quality
- Clean, readable, beginner-friendly code.
- Reusable components.
- No unused imports or dead code.
- No console errors.

## Acceptance Criteria
1. WHEN the user adds a task, THE SYSTEM SHALL display the task immediately and save it in localStorage.
2. WHEN the user edits a task, THE SYSTEM SHALL update the existing task without creating a duplicate.
3. WHEN the user deletes a task, THE SYSTEM SHALL ask for confirmation before removing it.
4. WHEN the user marks a task as completed, THE SYSTEM SHALL update the task status and visual style.
5. WHEN the user searches for a task, THE SYSTEM SHALL show matching tasks based on title, description, or category.
6. WHEN the user selects a filter, THE SYSTEM SHALL show only tasks that match the selected filter.
7. WHEN the user sorts tasks, THE SYSTEM SHALL reorder the task list correctly.
8. WHEN the user refreshes the page, THE SYSTEM SHALL keep all saved tasks using localStorage.
9. WHEN there are no tasks, THE SYSTEM SHALL show a clear and friendly empty state.
10. WHEN the app is viewed on mobile, THE SYSTEM SHALL keep the layout responsive and properly aligned.
