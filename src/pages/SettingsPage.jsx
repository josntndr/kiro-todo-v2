import { Sun, Moon, Keyboard, Monitor } from 'lucide-react';
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
    <div className="page settings-page" style={{ padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          Settings
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          margin: '4px 0 0',
        }}>
          Customize your TaskFlow experience
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Appearance Section */}
        <section style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '20px',
        }}>
          <h2 style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Monitor size={16} style={{ color: 'var(--color-text-muted)' }} />
            Appearance
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--color-text)',
                margin: '0 0 4px',
              }}>
                Theme
              </h3>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                margin: 0,
              }}>
                Switch between light and dark mode
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input)',
                color: 'var(--color-text)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} style={{ color: '#f59e0b' }} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </section>

        {/* Data Management Section */}
        <section style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '20px',
        }}>
          <h2 style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 16px',
          }}>
            Data Management
          </h2>
          <DataManager tasks={tasks} onImport={onImport} onToast={showToast} />
        </section>

        {/* Keyboard Shortcuts Section */}
        <section style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '20px',
        }}>
          <h2 style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Keyboard size={16} style={{ color: 'var(--color-text-muted)' }} />
            Keyboard Shortcuts
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}>
            {SHORTCUTS.map((shortcut) => (
              <div
                key={shortcut.description}
                style={{
                  background: 'var(--color-input)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                }}>
                  {shortcut.keys.map((key) => (
                    <kbd
                      key={key}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: 'monospace',
                      }}
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
                <span style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.3,
                }}>
                  {shortcut.description}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
