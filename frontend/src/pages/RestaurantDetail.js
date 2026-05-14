import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FoodCard from '../components/food/FoodCard';
import './RestaurantDetail.css';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/restaurants/${id}`);
        setRestaurant(data.data.restaurant);
        setMenu(data.data.menu);
        const firstCat = Object.keys(data.data.menu)[0];
        setActiveCategory(firstCat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!restaurant) return <div className="page-loader"><p>Restaurant not found</p></div>;

  const categories = Object.keys(menu);

  return (
    <div className="restaurant-detail fade-in">
      {/* Cover */}
      <div className="rest-cover">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
          alt={restaurant.name}
          className="cover-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'; }}
        />
        <div className="cover-overlay"></div>
        <div className="container cover-info">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="rest-detail-name">{restaurant.name}</h1>
          <p className="rest-detail-desc">{restaurant.description}</p>
          <div className="rest-detail-meta">
            <div className="meta-chip rating">
              <span>★</span> {restaurant.rating?.toFixed(1)} ({restaurant.totalReviews} reviews)
            </div>
            <div className="meta-chip">⏱️ {restaurant.deliveryTime}</div>
            <div className="meta-chip">🚚 ₹{restaurant.deliveryFee} delivery</div>
            <div className={`meta-chip ${restaurant.isOpen ? 'open' : 'closed'}`}>
              {restaurant.isOpen ? '● Open' : '● Closed'}
            </div>
          </div>
          {restaurant.cuisine?.length > 0 && (
            <div className="cuisines-wrap">
              {restaurant.cuisine.map(c => <span key={c} className="cuisine-tag">{c}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="container menu-section">
        {categories.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize: '3rem'}}>🍽️</div>
            <h3>No menu items available</h3>
            <p>Check back later for updates</p>
          </div>
        ) : (
          <div className="menu-layout">
            {/* Sidebar nav */}
            <aside className="menu-nav">
              <h3>Menu</h3>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`menu-nav-item ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {cat.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  <span className="menu-count">{menu[cat].length}</span>
                </button>
              ))}
            </aside>

            {/* Food items */}
            <div className="menu-content">
              {categories.map(cat => (
                <div key={cat} id={`cat-${cat}`} className="menu-category">
                  <h2 className="category-heading">
                    {cat.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </h2>
                  <div className="grid-3">
                    {menu[cat].map(item => (
                      <FoodCard key={item._id} item={item} restaurant={restaurant} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
