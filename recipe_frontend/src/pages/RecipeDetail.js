import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { fetchRecipeById } from '../api/client';
import './RecipeDetail.css';

// PUBLIC_INTERFACE
/**
 * Recipe detail page component
 * @returns {JSX.Element} RecipeDetail component
 */
const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAppContext();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const favorited = recipe ? isFavorite(recipe.id) : false;

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message || 'Failed to load recipe');
        console.error('Error loading recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  // PUBLIC_INTERFACE
  /**
   * Handle favorite toggle
   */
  const handleFavoriteToggle = () => {
    if (recipe) {
      toggleFavorite(recipe.id);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="recipe-detail-container">
        <div className="recipe-detail-loading" role="status" aria-live="polite">
          <div className="loading-spinner-large"></div>
          <p className="loading-text-large">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-container">
        <div className="recipe-detail-error" role="alert">
          <span className="error-icon-large">😞</span>
          <h2 className="error-title-large">Recipe Not Found</h2>
          <p className="error-text-large">{error}</p>
          <Link to="/" className="back-button-error">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-header">
        <button 
          onClick={handleBack} 
          className="back-button"
          aria-label="Go back to previous page"
        >
          ← Back
        </button>
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-hero">
          <img 
            src={recipe.image || 'https://via.placeholder.com/800x600?text=Recipe'} 
            alt={recipe.name}
            className="recipe-hero-image"
          />
          <button 
            className={`favorite-button-large ${favorited ? 'favorited' : ''}`}
            onClick={handleFavoriteToggle}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorited ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="recipe-info">
          <h1 className="recipe-title">{recipe.name}</h1>
          
          {recipe.description && (
            <p className="recipe-description">{recipe.description}</p>
          )}

          <div className="recipe-meta">
            {recipe.cookTime && (
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span className="meta-label">Cook Time:</span>
                <span className="meta-value">{recipe.cookTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="meta-item">
                <span className="meta-icon">🍽️</span>
                <span className="meta-label">Servings:</span>
                <span className="meta-value">{recipe.servings}</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="meta-item">
                <span className="meta-icon">📊</span>
                <span className="meta-label">Difficulty:</span>
                <span className={`difficulty-badge difficulty-${recipe.difficulty.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
              </div>
            )}
          </div>

          <div className="recipe-tags-section">
            {recipe.cuisine && (
              <span className="recipe-tag-large cuisine-tag">
                🌍 {recipe.cuisine}
              </span>
            )}
            {recipe.diet && (
              <span className="recipe-tag-large diet-tag">
                🥗 {recipe.diet}
              </span>
            )}
            {recipe.tags && recipe.tags.map((tag, index) => (
              <span key={index} className="recipe-tag-large other-tag">
                {tag}
              </span>
            ))}
          </div>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="recipe-section">
              <h2 className="section-title">🛒 Ingredients</h2>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-bullet">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.steps && recipe.steps.length > 0 && (
            <div className="recipe-section">
              <h2 className="section-title">👨‍🍳 Instructions</h2>
              <ol className="steps-list">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="step-item">
                    <span className="step-number">{index + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {recipe.notes && (
            <div className="recipe-section">
              <h2 className="section-title">📝 Notes</h2>
              <p className="recipe-notes">{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
