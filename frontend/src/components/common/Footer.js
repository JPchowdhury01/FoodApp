import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🍕 FoodApp</span>
          <p>Delivering happiness to your door, one meal at a time.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/restaurants">Restaurants</Link>
            <Link to="/orders">My Orders</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <span>support@foodapp.com</span>
            <span>+91 98765 43210</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FoodApp. Built with ❤️ using the MERN Stack.</p>
      </div>
    </footer>
  );
}
