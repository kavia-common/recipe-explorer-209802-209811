import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { fetchRecipes } from '../api/client';
import SearchBar from '../components/SearchBar';
import FiltersPanel from '../components/FiltersPanel';
import RecipeGrid from '../components/RecipeGrid';
import './Favorites.css';

// PUBLIC_INTERFACE
/**
 * Favorites page component
 * Displays a grid of the user's favorite recipes with search and filtering
 * @returns {JSX.Element} Favorites component
 */
const Favorites = () => {
  const { favorites, searchQuery, filters } = useAppContext();
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all recipes once to filter favorites from
  useEffect(() => {
    const loadAllRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all recipes without pagination, assuming the backend supports it or the number is manageable.
        // A more robust solution might involve a dedicated /api/recipes/favorites?ids=1,2,3 endpoint.
        const result = await fetchRecipes({}, '', 1, 1000); // Fetch a large number
        if (result.recipes) {
          setAllRecipes(result.recipes);
        }
      } catch (err) {
        setError(err.message || 'Failed to load recipes');
        console.error('Error fetching all recipes:', err);
         // Set mock data for demo purposes if API fails
        const mockRecipes = [
          { id: '1', name: 'Classic Margherita Pizza', description: 'A simple yet delicious Italian classic.', image: 'https://via.placeholder.com/400x300?text=Pizza', cuisine: 'Italian', diet: 'Vegetarian', cookTime: 30, difficulty: 'Easy' },
          { id: '2', name: 'Spicy Thai Green Curry', description: 'An aromatic and spicy Thai curry.', image: 'https://via.placeholder.com/400x300?text=Curry', cuisine: 'Thai', diet: 'Gluten-Free', cookTime: 45, difficulty: 'Medium'},
        ];
        setAllRecipes(mockRecipes);
      } finally {
        setLoading(false);
      }
    };

    loadAllRecipes();
  }, []);

  // Filter recipes based on favorites, search query, and filters
  const favoriteRecipes = useMemo(() => {
    let recipesToFilter = allRecipes.filter(recipe => favorites.includes(recipe.id));

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      recipesToFilter = recipesToFilter.filter(recipe =>
        recipe.name.toLowerCase().includes(lowercasedQuery) ||
        recipe.cuisine.toLowerCase().includes(lowercasedQuery) ||
        (recipe.ingredients && recipe.ingredients.join(' ').toLowerCase().includes(lowercasedQuery))
      );
    }

    if (filters.cuisine) {
      recipesToFilter = recipesToFilter.filter(recipe => recipe.cuisine.toLowerCase() === filters.cuisine.toLowerCase());
    }
    if (filters.diet) {
      recipesToFilter = recipesToFilter.filter(recipe => recipe.diet.toLowerCase() === filters.diet.toLowerCase());
    }
    if (filters.maxTime) {
      recipesToFilter = recipesToFilter.filter(recipe => recipe.cookTime <= parseInt(filters.maxTime, 10));
    }

    return recipesToFilter;
  }, [allRecipes, favorites, searchQuery, filters]);

  const hasActiveFilters = filters.cuisine || filters.diet || filters.maxTime;

  if (loading) {
    return (
      <div className="favorites-container">
        <RecipeGrid recipes={[]} loading={true} error={null} />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <div className="empty-favorites">
          <span className="empty-favorites-icon">💔</span>
          <h2 className="empty-favorites-title">Your Favorites is Empty</h2>
          <p className="empty-favorites-text">
            You haven't added any recipes to your favorites yet. Start exploring and save the recipes you love!
          </p>
          <Link to="/" className="browse-recipes-button">
            Browse Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorites-title">
          <span className="favorites-icon">❤️</span>
          My Favorite Recipes
        </h1>
        <p className="favorites-subtitle">
          Your hand-picked collection of delicious recipes.
        </p>
      </div>

       <div className="search-section" style={{marginBottom: "2rem"}}>
          <SearchBar />
          <button 
            className="filters-toggle"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            🎯 Filters
            {hasActiveFilters && (
              <span className="filters-active-badge" aria-label="Filters active">•</span>
            )}
          </button>
        </div>

      <div className="favorites-content">
        {showFilters && (
          <aside className="filters-sidebar">
            <FiltersPanel />
          </aside>
        )}
        <main className="favorites-main">
          <RecipeGrid recipes={favoriteRecipes} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
};

export default Favorites;
