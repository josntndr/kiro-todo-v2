import { NavLink, useNavigate } from 'react-router-dom';
import { ListTodo, Timer, Activity, Archive, Settings, ListChecks, LogOut, User, CalendarDays, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/archive', icon: Archive, label: 'Archive' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function Sidebar({ archivedCount }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  }

  const displayName = currentUser?.displayName
    || currentUser?.email?.split('@')[0]
    || '';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <ListChecks size={24} className="sidebar-brand-icon" />
        <span className="sidebar-brand-name">
          <span style={{ color: '#ffffff' }}>Task</span>
          <span style={{ color: '#3b82f6' }}>Flow</span>
        </span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span className="sidebar-nav-label">{item.label}</span>
              {item.to === '/archive' && archivedCount > 0 && (
                <span className="sidebar-badge">{archivedCount}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-user">
        {currentUser && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              <User size={16} />
            </div>
            <div>
              <div className="sidebar-user-name">{displayName}</div>
              <span className="sidebar-user-email">
                {currentUser.email}
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
