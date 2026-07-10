import { Search } from 'lucide-react';

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        placeholder="Search tasks by title, description, or category..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks"
      />
    </div>
  );
}

export default SearchBar;
