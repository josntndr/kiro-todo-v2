import { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['N'], description: 'Focus new task input' },
  { keys: ['/', 'Ctrl+K'], description: 'Focus search bar' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['T'], description: 'Toggle theme' },
  { keys: ['V'], description: 'Toggle view (list/kanban)' },
  { keys: ['Esc'], description: 'Close modals / Cancel edit' },
];

function KeyboardShortcuts({ isOpen, onClose }) {
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Keyboard size={20} />
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="shortcuts-list">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.description} className="shortcut-item">
              <div className="shortcut-keys">
                {shortcut.keys.map((key) => (
                  <kbd key={key} className="shortcut-key">{key}</kbd>
                ))}
              </div>
              <span className="shortcut-description">{shortcut.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;
