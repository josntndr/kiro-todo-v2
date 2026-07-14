import { Search, X } from 'lucide-react';

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" aria-hidden="true" />
      <input
        type="text"
        placeholder="Search tasks by title, description, category, or tag..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks"
      />
      {searchQuery && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
