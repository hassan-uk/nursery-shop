import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon">🌿</span>
              <span className="logo-text">Green Haven Nursery</span>
            </Link>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">Search</button>
            </form>

            <nav className="header-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="header-link">
                    <span className="icon">👤</span>
                    <span className="link-text">{user?.firstName}</span>
                  </Link>
                  <Link to="/orders" className="header-link">
                    <span className="icon">📦</span>
                    <span className="link-text">Orders</span>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="header-link">
                  <span className="icon">👤</span>
                  <span className="link-text">Sign In</span>
                </Link>
              )}
              <Link to="/cart" className="header-link cart-link">
                <span className="icon">🛒</span>
                <span className="link-text">Cart</span>
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>
            </nav>

            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>All Plants</Link>
            <Link to="/products?category=indoor-plants" onClick={() => setMobileMenuOpen(false)}>Indoor</Link>
            <Link to="/products?category=outdoor-plants" onClick={() => setMobileMenuOpen(false)}>Outdoor</Link>
            <Link to="/products?category=succulents" onClick={() => setMobileMenuOpen(false)}>Succulents</Link>
            <Link to="/products?category=flowering-plants" onClick={() => setMobileMenuOpen(false)}>Flowering</Link>
            <Link to="/products?category=herbs" onClick={() => setMobileMenuOpen(false)}>Herbs</Link>
            <Link to="/products?category=plant-care" onClick={() => setMobileMenuOpen(false)}>Plant Care</Link>
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="container">
            <form className="mobile-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
            <div className="mobile-links">
              {isAuthenticated ? (
                <>
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                  <button onClick={handleLogout} className="mobile-logout">Sign Out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
