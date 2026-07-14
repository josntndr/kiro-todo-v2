import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Circle, CheckCircle2, CalendarDays } from 'lucide-react';
import './CalendarPage.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function CalendarPage({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Group tasks by due date
  const tasksByDate = useMemo(() => {
    const map = {};
    (tasks || []).forEach((task) => {
      if (task.dueDate) {
        const key = task.dueDate; // format: YYYY-MM-DD
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    });
    return map;
  }, [tasks]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, key: `empty-${i}` });
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        dateStr,
        key: dateStr,
        tasks: tasksByDate[dateStr] || [],
      });
    }

    return days;
  }, [year, month, tasksByDate]);

  function goToPrevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }

  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  function goToToday() {
    setCurrentDate(new Date());
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDate(todayStr);
  }

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();

  // Selected date tasks
  const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : [];

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <p>View your tasks by date</p>
      </div>

      <div className="calendar-layout">
        {/* Calendar grid */}
        <div className="calendar-panel">
          <div className="calendar-nav">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={goToPrevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="calendar-month-title">
              {MONTHS[month]} {year}
            </h2>
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              className="calendar-today-btn"
              onClick={goToToday}
            >
              Today
            </button>
          </div>

          <div className="calendar-grid">
            {DAYS.map((day) => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {calendarDays.map((cell) => {
              if (!cell.day) {
                return <div key={cell.key} className="calendar-cell calendar-cell--empty" />;
              }
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDate;
              const hasTask = cell.tasks.length > 0;
              const completedAll = hasTask && cell.tasks.every((t) => t.completed);

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={[
                    'calendar-cell',
                    isToday ? 'calendar-cell--today' : '',
                    isSelected ? 'calendar-cell--selected' : '',
                    hasTask ? 'calendar-cell--has-tasks' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  aria-label={`${cell.dateStr}, ${cell.tasks.length} tasks`}
                >
                  <span className="calendar-cell-day">{cell.day}</span>
                  {hasTask && (
                    <span className={`calendar-cell-dot ${completedAll ? 'calendar-cell-dot--done' : ''}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected date detail */}
        <div className="calendar-detail">
          <h3 className="calendar-detail-title">
            <CalendarDays size={18} aria-hidden="true" />
            {selectedDate
              ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Select a date'}
          </h3>

          {!selectedDate && (
            <p className="calendar-detail-empty">Click a date to see tasks due on that day.</p>
          )}

          {selectedDate && selectedTasks.length === 0 && (
            <p className="calendar-detail-empty">No tasks due on this date.</p>
          )}

          {selectedTasks.length > 0 && (
            <ul className="calendar-task-list">
              {selectedTasks.map((task) => (
                <li key={task.id} className={`calendar-task-item ${task.completed ? 'calendar-task-item--done' : ''}`}>
                  <span className="calendar-task-icon">
                    {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </span>
                  <span className="calendar-task-title">{task.title}</span>
                  <span className={`calendar-task-priority priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
