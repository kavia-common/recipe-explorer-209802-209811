import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import FiltersPanel from '../components/FiltersPanel';
import RecipeGrid from '../components/RecipeGrid';
import { fetchRecipes, fetchFeaturedRecipes } from '../api/client';
import './Home.css';

// PUBLIC_INTERFACE
/**
 * Home page component with recipe browsing, filtering, and infinite scroll
 * @returns {JSX.Element} Home component
 */
const Home = () => {
  const { 
    searchQuery, 
    filters, 
    currentPage,
    hasMore,
    setHasMore,
    isLoadingMore,
    setIsLoadingMore,
    loadNextPage,
    resetPagination
  } = useAppContext();
  
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Ref for intersection observer
  const observerTarget = useRef(null);
  const loadingRef = useRef(false);

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

  // PUBLIC_INTERFACE
  /**
   * Load recipes with pagination support
   * @param {number} page - Page number to load
   * @param {boolean} append - Whether to append to existing recipes or replace
   */
  const loadRecipes = useCallback(async (page, append = false) => {
    // Prevent duplicate requests
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
        setRecipes([]);
      }
      
      setError(null);
      
      const result = await fetchRecipes(filters, searchQuery, page, 12);
      
      if (append) {
        setRecipes(prev => [...prev, ...result.recipes]);
      } else {
        setRecipes(result.recipes);
      }
      
      setHasMore(result.hasMore);
      
    } catch (err) {
      setError(err.message || 'Failed to load recipes');
      console.error('Error loading recipes:', err);
      
      // Set mock data for demo purposes only on first page
      if (!append) {
        const mockRecipes = [
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
        ];
        setRecipes(mockRecipes);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [filters, searchQuery, setHasMore, setIsLoadingMore]);

  // Reset and load first page when search or filters change
  useEffect(() => {
    resetPagination();
    setRecipes([]);
    loadRecipes(1, false);
  }, [searchQuery, filters, resetPagination]);

  // Load next page when currentPage changes (triggered by infinite scroll)
  useEffect(() => {
    if (currentPage > 1) {
      loadRecipes(currentPage, true);
    }
  }, [currentPage, loadRecipes]);

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
          loadNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loading, loadNextPage]);

  // PUBLIC_INTERFACE
  /**
   * Toggle filters panel visibility
   */
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle manual Load More button click
   */
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadNextPage();
    }
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
            
            {/* Intersection Observer Target */}
            <div ref={observerTarget} style={{ height: '20px' }} />
            
            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="loading-more" role="status" aria-live="polite">
                <div className="loading-spinner-small">
                  <div className="spinner-small"></div>
                  <p className="loading-text-small">Loading more recipes...</p>
                </div>
              </div>
            )}
            
            {/* Load More Button Fallback */}
            {!loading && !isLoadingMore && hasMore && recipes.length > 0 && (
              <div className="load-more-container">
                <button 
                  className="load-more-button"
                  onClick={handleLoadMore}
                  aria-label="Load more recipes"
                >
                  Load More Recipes
                </button>
              </div>
            )}
            
            {/* End of list indicator */}
            {!loading && !hasMore && recipes.length > 0 && (
              <div className="end-of-list">
                <p className="end-of-list-text">
                  🎉 You've reached the end of the list!
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
