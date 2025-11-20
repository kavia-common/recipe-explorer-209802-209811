import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './NavBar.css';

// PUBLIC_INTERFACE
/**
 * Navigation bar component with branding, navigation links, and favorites badge
 * @returns {JSX.Element} NavBar component
 */
const NavBar = () => {
  const { favorites } = useAppContext();
  const location = useLocation();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Recipe Explorer Home">
          <span className="brand-icon">🍳</span>
          <span className="brand-text">Recipe Explorer</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            <span className="link-icon">🏠</span>
            Home
          </Link>
          
          <Link
            to="/favorites"
            className={`nav-link favorites-link ${location.pathname === '/favorites' ? 'active' : ''}`}
            aria-label={`Favorites (${favorites.length} items)`}
            aria-current={location.pathname === '/favorites' ? 'page' : undefined}
          >
              <span className="link-icon">❤️</span>
              Favorites
              {favorites.length > 0 && (
                <span className="favorites-count" aria-hidden="true">
                  {favorites.length}
                </span>
              )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
