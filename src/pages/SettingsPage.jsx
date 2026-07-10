import { Sun, Moon, Keyboard } from 'lucide-react';
import DataManager from '../components/DataManager';

const SHORTCUTS = [
  { keys: ['N'], description: 'Focus new task input' },
  { keys: ['/', 'Ctrl+K'], description: 'Focus search bar' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['T'], description: 'Toggle theme' },
  { keys: ['V'], description: 'Toggle view (list/kanban)' },
  { keys: ['Esc'], description: 'Close modals / Cancel edit' },
];

function SettingsPage({ theme, onToggleTheme, tasks, onImport, showToast }) {
  return (
    <div className="page settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Customize your TaskFlow experience</p>
      </div>

      <div className="settings-sections">
        {/* Theme Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Appearance</h2>
          <div className="settings-option">
            <div className="settings-option-info">
              <h3>Theme</h3>
              <p>Switch between light and dark mode</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary settings-theme-btn"
              onClick={onToggleTheme}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Data Management</h2>
          <DataManager tasks={tasks} onImport={onImport} onToast={showToast} />
        </section>

        {/* Keyboard Shortcuts Section */}
        <section className="settings-section">
          <h2 className="settings-section-title">
            <Keyboard size={18} />
            Keyboard Shortcuts
          </h2>
          <div className="settings-shortcuts-list">
            {SHORTCUTS.map((shortcut) => (
              <div key={shortcut.description} className="settings-shortcut-item">
                <div className="shortcut-keys">
                  {shortcut.keys.map((key) => (
                    <kbd key={key} className="shortcut-key">{key}</kbd>
                  ))}
                </div>
                <span className="shortcut-description">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
