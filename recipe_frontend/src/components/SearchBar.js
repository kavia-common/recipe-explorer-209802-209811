import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import './SearchBar.css';

// PUBLIC_INTERFACE
/**
 * Search bar component with debounced input
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback when search is triggered
 * @returns {JSX.Element} SearchBar component
 */
const SearchBar = ({ onSearch }) => {
  const { searchQuery, setSearchQuery } = useAppContext();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search query updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(localQuery);
      if (onSearch) {
        onSearch(localQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localQuery, setSearchQuery, onSearch]);

  // PUBLIC_INTERFACE
  /**
   * Handle input change
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle clear button click
   */
  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="search-bar" role="search">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search for recipes, ingredients, or cuisines..."
          value={localQuery}
          onChange={handleChange}
          aria-label="Search recipes"
        />
        {localQuery && (
          <button 
            className="search-clear" 
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
