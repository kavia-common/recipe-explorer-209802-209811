import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipeGrid.css';

// PUBLIC_INTERFACE
/**
 * Recipe grid component for displaying multiple recipe cards
 * @param {Object} props - Component props
 * @param {Array} props.recipes - Array of recipe objects
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @returns {JSX.Element} RecipeGrid component
 */
const RecipeGrid = ({ recipes, loading, error }) => {
  if (loading) {
    return (
      <div className="recipe-grid-status" role="status" aria-live="polite">
        <div className="loading-spinner" aria-label="Loading recipes">
          <div className="spinner"></div>
          <p className="loading-text">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-grid-status" role="alert">
        <div className="error-message">
          <span className="error-icon" aria-hidden="true">😞</span>
          <h3 className="error-title">Oops! Something went wrong</h3>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="recipe-grid-status">
        <div className="empty-message">
          <span className="empty-icon" aria-hidden="true">🔍</span>
          <h3 className="empty-title">No recipes found</h3>
          <p className="empty-text">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-grid" role="list">
      {recipes.map((recipe) => (
        <div key={recipe.id} role="listitem">
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid;
