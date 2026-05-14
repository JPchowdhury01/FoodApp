import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/food/RestaurantCard';
import FoodCard from '../components/food/FoodCard';
import './Home.css';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'veg', label: 'Veg', icon: '🥦' },
  { id: 'non-veg', label: 'Non-Veg', icon: '🍗' },
  { id: 'fast-food', label: 'Fast Food', icon: '🍔' },
  { id: 'pizza', label: 'Pizza', icon: '🍕' },
  { id: 'dessert', label: 'Desserts', icon: '🍰' },
  { id: 'beverages', label: 'Drinks', icon: '🧃' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, foodRes] = await Promise.all([
          api.get('/restaurants?limit=6'),
          api.get('/food?isPopular=true&limit=8')
        ]);
        setRestaurants(restRes.data.data);
        setPopularItems(foodRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') navigate('/restaurants');
    else navigate(`/restaurants?category=${cat}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob1"></div>
          <div className="hero-blob blob2"></div>
          <div className="hero-blob blob3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <span className="hero-tag">🚀 Fast Delivery in 30 mins</span>
            <h1 className="hero-title">
              Delicious Food,<br />
              <span className="hero-accent">Delivered Fast</span>
            </h1>
            <p className="hero-subtitle">
              Order from hundreds of restaurants and get your favorite food delivered to your doorstep.
            </p>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrap">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search for restaurants or food..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn btn-primary search-btn">Search</button>
              </div>
            </form>
            <div className="hero-stats">
              <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Restaurants</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><span className="stat-num">10k+</span><span className="stat-label">Happy Users</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><span className="stat-num">30 min</span><span className="stat-label">Avg. Delivery</span></div>
            </div>
          </div>
          <div className="hero-image fade-in">
            <div className="hero-img-container">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600" alt="Delicious Food" />
              <div className="floating-card card1">
                <span>🍕</span> Pizza Margherita
                <span className="price-chip">₹299</span>
              </div>
              <div className="floating-card card2">
                <span>⏱️</span> 28 mins delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Top Restaurants</h2>
              <p className="section-subtitle">Explore the best places near you</p>
            </div>
            <Link to="/restaurants" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card skeleton-card">
                  <div className="skeleton" style={{height: 180}}></div>
                  <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
                    <div className="skeleton" style={{height: 18, width: '70%'}}></div>
                    <div className="skeleton" style={{height: 14, width: '50%'}}></div>
                    <div className="skeleton" style={{height: 14, width: '90%'}}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>
          )}
        </div>
      </section>

      {/* Popular Items */}
      <section className="section popular-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Popular Dishes</h2>
              <p className="section-subtitle">Loved by thousands of food enthusiasts</p>
            </div>
          </div>
          {loading ? (
            <div className="grid-4">
              {[...Array(8)].map((_, i) => <div key={i} className="card skeleton-card"><div className="skeleton" style={{height: 160}}></div><div style={{padding: 14}}><div className="skeleton" style={{height: 16, marginBottom: 8}}></div><div className="skeleton" style={{height: 12, width: '60%'}}></div></div></div>)}
            </div>
          ) : (
            <div className="grid-4">
              {popularItems.map(item => (
                <FoodCard
                  key={item._id}
                  item={item}
                  restaurant={item.restaurantId}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="section why-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose FoodApp?</h2>
          <p className="section-subtitle text-center">The best food ordering experience</p>
          <div className="grid-3 why-grid">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Get your food delivered in under 30 minutes with our express delivery network.' },
              { icon: '🍴', title: 'Premium Quality', desc: 'Only the best restaurants with verified ratings and fresh ingredients.' },
              { icon: '🛡️', title: 'Secure & Safe', desc: 'Your orders and payments are protected with bank-grade encryption.' }
            ].map((item, i) => (
              <div key={i} className="why-card card">
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
