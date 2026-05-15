import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍕</span>
          <span className="brand-name">Servd</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link
            to="/restaurants"
            className={`nav-link ${isActive("/restaurants") ? "active" : ""}`}
          >
            Restaurants
          </Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>
              <div className="user-menu" ref={menuRef}>
                <button
                  className="user-avatar"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <button
                      className="dropdown-item logout"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
