import { NavLink } from 'react-router-dom';
import { ListTodo, LayoutDashboard, Timer, Activity, Archive, Settings, CheckCheck } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/archive', icon: Archive, label: 'Archive' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function Sidebar({ archivedCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <CheckCheck size={24} className="sidebar-brand-icon" />
        <span className="sidebar-brand-name">TaskFlow</span>
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
    </aside>
  );
}

export default Sidebar;
