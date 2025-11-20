import React from 'react';
import { useAppContext } from '../context/AppContext';
import './FiltersPanel.css';

// PUBLIC_INTERFACE
/**
 * Filters panel component for filtering recipes
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback when filters change
 * @returns {JSX.Element} FiltersPanel component
 */
const FiltersPanel = ({ onFilterChange }) => {
  const { filters, updateFilters, resetFilters } = useAppContext();

  // PUBLIC_INTERFACE
  /**
   * Handle filter change
   * @param {string} filterName - Name of the filter
   * @param {string} value - New value for the filter
   */
  const handleFilterChange = (filterName, value) => {
    const newFilters = { [filterName]: value };
    updateFilters(newFilters);
    if (onFilterChange) {
      onFilterChange({ ...filters, ...newFilters });
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle reset filters
   */
  const handleReset = () => {
    resetFilters();
    if (onFilterChange) {
      onFilterChange({ cuisine: '', diet: '', maxTime: '' });
    }
  };

  const hasActiveFilters = filters.cuisine || filters.diet || filters.maxTime;

  return (
    <div className="filters-panel" role="group" aria-label="Recipe filters">
      <div className="filters-header">
        <h3 className="filters-title">🎯 Filters</h3>
        {hasActiveFilters && (
          <button 
            className="filters-reset" 
            onClick={handleReset}
            aria-label="Reset all filters"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="cuisine-filter" className="filter-label">
          🌍 Cuisine
        </label>
        <select
          id="cuisine-filter"
          className="filter-select"
          value={filters.cuisine}
          onChange={(e) => handleFilterChange('cuisine', e.target.value)}
          aria-label="Filter by cuisine"
        >
          <option value="">All Cuisines</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
          <option value="chinese">Chinese</option>
          <option value="indian">Indian</option>
          <option value="japanese">Japanese</option>
          <option value="american">American</option>
          <option value="french">French</option>
          <option value="thai">Thai</option>
          <option value="mediterranean">Mediterranean</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="diet-filter" className="filter-label">
          🥗 Diet
        </label>
        <select
          id="diet-filter"
          className="filter-select"
          value={filters.diet}
          onChange={(e) => handleFilterChange('diet', e.target.value)}
          aria-label="Filter by diet type"
        >
          <option value="">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten-Free</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
          <option value="dairy-free">Dairy-Free</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="time-filter" className="filter-label">
          ⏱️ Max Time
        </label>
        <select
          id="time-filter"
          className="filter-select"
          value={filters.maxTime}
          onChange={(e) => handleFilterChange('maxTime', e.target.value)}
          aria-label="Filter by maximum cooking time"
        >
          <option value="">Any Time</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
          <option value="120">2 hours</option>
        </select>
      </div>
    </div>
  );
};

export default FiltersPanel;
