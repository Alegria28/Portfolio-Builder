import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          Portfolio Builder
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>
              🏠 Home
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/templates" className={isActive('/templates')}>
                  🎨 Templates
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={isActive('/dashboard')}>
                  📊 Dashboard
                </Link>
              </li>
              <li className="user-menu">
                <span className="user-greeting">
                  👋 {user?.first_name || user?.username}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/pricing" className={isActive('/pricing')}>
                  💰 Pricing
                </Link>
              </li>
              <li>
                <Link to="/login" className={isActive('/login')}>
                  🔑 Login
                </Link>
              </li>
              <li>
                <Link to="/register" className={isActive('/register')}>
                  ✨ Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;