import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import FiltersPanel from '../components/FiltersPanel';
import RecipeGrid from '../components/RecipeGrid';
import { fetchRecipes, fetchFeaturedRecipes } from '../api/client';
import './Home.css';

// PUBLIC_INTERFACE
/**
 * Home page component with recipe browsing and filtering
 * @returns {JSX.Element} Home component
 */
const Home = () => {
  const { searchQuery, filters } = useAppContext();
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load featured recipes on mount
  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        const data = await fetchFeaturedRecipes();
        setFeaturedRecipes(data);
      } catch (err) {
        console.error('Error loading featured recipes:', err);
        // Don't set error state for featured recipes failure
      }
    };

    loadFeaturedRecipes();
  }, []);

  // Load recipes when search or filters change
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecipes(filters, searchQuery);
        setRecipes(data);
      } catch (err) {
        setError(err.message || 'Failed to load recipes');
        console.error('Error loading recipes:', err);
        // Set mock data for demo purposes
        setRecipes([
          {
            id: '1',
            name: 'Classic Margherita Pizza',
            description: 'A simple yet delicious Italian classic with fresh mozzarella, basil, and tomato sauce.',
            image: 'https://via.placeholder.com/400x300?text=Pizza',
            cuisine: 'Italian',
            diet: 'Vegetarian',
            cookTime: 30,
            difficulty: 'Easy',
          },
          {
            id: '2',
            name: 'Spicy Thai Green Curry',
            description: 'An aromatic and spicy Thai curry with coconut milk, vegetables, and your choice of protein.',
            image: 'https://via.placeholder.com/400x300?text=Curry',
            cuisine: 'Thai',
            diet: 'Gluten-Free',
            cookTime: 45,
            difficulty: 'Medium',
          },
          {
            id: '3',
            name: 'Chocolate Lava Cake',
            description: 'Decadent chocolate cake with a molten center, perfect for dessert lovers.',
            image: 'https://via.placeholder.com/400x300?text=Dessert',
            cuisine: 'French',
            cookTime: 25,
            difficulty: 'Hard',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [searchQuery, filters]);

  // PUBLIC_INTERFACE
  /**
   * Toggle filters panel visibility
   */
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasSearchOrFilters = searchQuery || filters.cuisine || filters.diet || filters.maxTime;

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="hero-icon">🍳</span>
            Discover Amazing Recipes
          </h1>
          <p className="hero-subtitle">
            Explore thousands of delicious recipes from around the world
          </p>
        </div>

        <div className="search-section">
          <SearchBar />
          <button 
            className="filters-toggle"
            onClick={toggleFilters}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            🎯 Filters
            {(filters.cuisine || filters.diet || filters.maxTime) && (
              <span className="filters-active-badge" aria-label="Filters active">•</span>
            )}
          </button>
        </div>
      </div>

      <div className="home-content">
        {showFilters && (
          <aside className="filters-sidebar">
            <FiltersPanel />
          </aside>
        )}

        <main className="recipes-main" role="main">
          {!hasSearchOrFilters && featuredRecipes.length > 0 && (
            <section className="featured-section" aria-labelledby="featured-heading">
              <h2 id="featured-heading" className="section-heading">
                ⭐ Featured Recipes
              </h2>
              <RecipeGrid recipes={featuredRecipes.slice(0, 3)} />
            </section>
          )}

          <section className="all-recipes-section" aria-labelledby="all-recipes-heading">
            <h2 id="all-recipes-heading" className="section-heading">
              {hasSearchOrFilters ? '🔍 Search Results' : '📖 All Recipes'}
            </h2>
            <RecipeGrid recipes={recipes} loading={loading} error={error} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
