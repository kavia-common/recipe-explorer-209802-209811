import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// PUBLIC_INTERFACE
/**
 * Custom hook to use the App context
 * @returns {Object} Context value with state and actions
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
/**
 * App Context Provider component
 * Manages global state for search, filters, favorites, and pagination
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    diet: '',
    maxTime: '',
  });
  const [favorites, setFavorites] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('recipe_favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('recipe_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  // PUBLIC_INTERFACE
  /**
   * Add a recipe to favorites
   * @param {string} recipeId - The ID of the recipe to add
   */
  const addFavorite = (recipeId) => {
    if (!favorites.includes(recipeId)) {
      setFavorites([...favorites, recipeId]);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Remove a recipe from favorites
   * @param {string} recipeId - The ID of the recipe to remove
   */
  const removeFavorite = (recipeId) => {
    setFavorites(favorites.filter(id => id !== recipeId));
  };

  // PUBLIC_INTERFACE
  /**
   * Toggle a recipe's favorite status
   * @param {string} recipeId - The ID of the recipe to toggle
   */
  const toggleFavorite = (recipeId) => {
    if (favorites.includes(recipeId)) {
      removeFavorite(recipeId);
    } else {
      addFavorite(recipeId);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Check if a recipe is favorited
   * @param {string} recipeId - The ID of the recipe to check
   * @returns {boolean} True if the recipe is favorited
   */
  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  // PUBLIC_INTERFACE
  /**
   * Update filter values and reset pagination
   * @param {Object} newFilters - New filter values to merge
   */
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
    setHasMore(true);
  };

  // PUBLIC_INTERFACE
  /**
   * Reset all filters to default values and reset pagination
   */
  const resetFilters = () => {
    setFilters({
      cuisine: '',
      diet: '',
      maxTime: '',
    });
    setCurrentPage(1);
    setHasMore(true);
  };

  // PUBLIC_INTERFACE
  /**
   * Reset pagination to initial state
   */
  const resetPagination = () => {
    setCurrentPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  };

  // PUBLIC_INTERFACE
  /**
   * Increment page number for loading next page
   */
  const loadNextPage = () => {
    if (hasMore && !isLoadingMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const value = {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    resetFilters,
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    // Pagination state and actions
    currentPage,
    setCurrentPage,
    hasMore,
    setHasMore,
    isLoadingMore,
    setIsLoadingMore,
    resetPagination,
    loadNextPage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
