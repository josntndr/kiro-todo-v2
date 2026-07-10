import { useRef, useState } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { exportTasksAsJSON, exportTasksAsCSV, validateImportedTasks, downloadFile, migrateTasks } from '../utils/taskUtils';

function DataManager({ tasks, onImport, onToast }) {
  const fileInputRef = useRef(null);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importMode, setImportMode] = useState('merge');

  function handleExportJSON() {
    const json = exportTasksAsJSON(tasks);
    const filename = `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(json, filename, 'application/json');
    onToast('Tasks exported as JSON!', 'success');
  }

  function handleExportCSV() {
    const csv = exportTasksAsCSV(tasks);
    const filename = `taskflow-export-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(csv, filename, 'text/csv');
    onToast('Tasks exported as CSV!', 'success');
  }

  function handleImportClick() {
    setShowImportOptions(true);
  }

  function handleFileSelect() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      onToast('Please select a .json file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const { valid, error } = validateImportedTasks(data);

        if (!valid) {
          onToast(`Import failed: ${error}`, 'error');
          return;
        }

        const migratedData = migrateTasks(data);
        onImport(migratedData, importMode);
        setShowImportOptions(false);
        onToast(
          importMode === 'replace'
            ? `Imported ${migratedData.length} tasks (replaced all).`
            : `Merged ${migratedData.length} tasks.`,
          'success'
        );
      } catch {
        onToast('Import failed: Invalid JSON file.', 'error');
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be imported again
    e.target.value = '';
  }

  return (
    <div className="data-manager">
      <div className="data-manager-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportJSON}>
          <FileJson size={14} />
          Export JSON
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <FileSpreadsheet size={14} />
          Export CSV
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleImportClick}>
          <Upload size={14} />
          Import
        </button>
      </div>

      {showImportOptions && (
        <div className="data-manager-import">
          <div className="import-options">
            <label className="import-option">
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={importMode === 'merge'}
                onChange={(e) => setImportMode(e.target.value)}
              />
              <span>Merge (add new, skip duplicates)</span>
            </label>
            <label className="import-option">
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === 'replace'}
                onChange={(e) => setImportMode(e.target.value)}
              />
              <span>Replace all tasks</span>
            </label>
          </div>
          <div className="import-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={handleFileSelect}>
              <Download size={14} />
              Choose File
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowImportOptions(false)}
            >
              Cancel
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
}

export default DataManager;
