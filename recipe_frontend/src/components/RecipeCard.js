import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './RecipeCard.css';

// PUBLIC_INTERFACE
/**
 * Recipe card component for displaying recipe summary in a grid
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe data object
 * @returns {JSX.Element} RecipeCard component
 */
const RecipeCard = ({ recipe }) => {
  const { isFavorite, toggleFavorite } = useAppContext();
  const favorited = isFavorite(recipe.id);

  // PUBLIC_INTERFACE
  /**
   * Handle favorite button click
   * @param {React.MouseEvent} e - Click event
   */
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card" aria-label={`View ${recipe.name} recipe`}>
      <div className="recipe-card-image-wrapper">
        <img 
          src={recipe.image || 'https://via.placeholder.com/400x300?text=Recipe'} 
          alt={recipe.name}
          className="recipe-card-image"
          loading="lazy"
        />
        <button 
          className={`favorite-button ${favorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorited ? '❤️' : '🤍'}
        </button>
        {recipe.cookTime && (
          <span className="recipe-time-badge" aria-label={`Cooking time: ${recipe.cookTime} minutes`}>
            ⏱️ {recipe.cookTime} min
          </span>
        )}
      </div>
      
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.name}</h3>
        
        {recipe.description && (
          <p className="recipe-card-description">
            {recipe.description.length > 100 
              ? `${recipe.description.substring(0, 100)}...` 
              : recipe.description}
          </p>
        )}
        
        <div className="recipe-card-tags">
          {recipe.cuisine && (
            <span className="recipe-tag cuisine-tag" aria-label={`Cuisine: ${recipe.cuisine}`}>
              🌍 {recipe.cuisine}
            </span>
          )}
          {recipe.diet && (
            <span className="recipe-tag diet-tag" aria-label={`Diet: ${recipe.diet}`}>
              🥗 {recipe.diet}
            </span>
          )}
        </div>
        
        {recipe.difficulty && (
          <div className="recipe-difficulty" aria-label={`Difficulty: ${recipe.difficulty}`}>
            <span className="difficulty-label">Difficulty:</span>
            <span className={`difficulty-value difficulty-${recipe.difficulty.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RecipeCard;
