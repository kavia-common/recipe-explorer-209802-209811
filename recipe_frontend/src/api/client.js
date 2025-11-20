/**
 * API Client for Recipe Explorer
 * Reads base URL from REACT_APP_API_BASE or REACT_APP_BACKEND_URL environment variables
 */

// PUBLIC_INTERFACE
/**
 * Get the API base URL from environment variables
 * Priority: REACT_APP_API_BASE > REACT_APP_BACKEND_URL > relative '/api'
 * @returns {string} The base URL for API calls
 */
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_BASE || 
         process.env.REACT_APP_BACKEND_URL || 
         '/api';
};

// PUBLIC_INTERFACE
/**
 * Make a GET request to the API
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<any>} The response data
 */
export const apiGet = async (endpoint) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API GET error:', error);
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Make a POST request to the API
 * @param {string} endpoint - The API endpoint
 * @param {any} data - The data to send
 * @returns {Promise<any>} The response data
 */
export const apiPost = async (endpoint, data) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API POST error:', error);
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Fetch all recipes with optional filters
 * @param {Object} filters - Filter parameters (cuisine, diet, maxTime)
 * @param {string} searchQuery - Search query string
 * @returns {Promise<Array>} Array of recipes
 */
export const fetchRecipes = async (filters = {}, searchQuery = '') => {
  let endpoint = '/recipes';
  const params = new URLSearchParams();
  
  if (searchQuery) params.append('search', searchQuery);
  if (filters.cuisine) params.append('cuisine', filters.cuisine);
  if (filters.diet) params.append('diet', filters.diet);
  if (filters.maxTime) params.append('maxTime', filters.maxTime);
  
  const queryString = params.toString();
  if (queryString) endpoint += `?${queryString}`;
  
  return await apiGet(endpoint);
};

// PUBLIC_INTERFACE
/**
 * Fetch a single recipe by ID
 * @param {string} id - Recipe ID
 * @returns {Promise<Object>} Recipe details
 */
export const fetchRecipeById = async (id) => {
  return await apiGet(`/recipes/${id}`);
};

// PUBLIC_INTERFACE
/**
 * Fetch featured recipes
 * @returns {Promise<Array>} Array of featured recipes
 */
export const fetchFeaturedRecipes = async () => {
  return await apiGet('/recipes/featured');
};

// PUBLIC_INTERFACE
/**
 * Fetch recipe categories
 * @returns {Promise<Array>} Array of categories
 */
export const fetchCategories = async () => {
  return await apiGet('/categories');
};
