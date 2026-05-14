import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './FoodCard.css';

export default function FoodCard({ item, restaurant }) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const cartItem = cartItems.find(i => i._id === item._id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    setTimeout(() => setAdding(false), 600);
    addToCart(item, restaurant);
  };

  const isVeg = item.category === 'veg' || item.category === 'vegan';

  return (
    <div className={`food-card card ${adding ? 'adding' : ''}`}>
      <div className="food-img-wrap">
        <img
          src={item.image || `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300`}
          alt={item.name}
          className="food-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'; }}
        />
        {item.isBestSeller && <div className="bestseller-tag">BESTSELLER</div>}
      </div>
      <div className="food-info">
        <div className="food-type-wrap">
          <div className={`food-type-dot ${isVeg ? 'veg' : 'non-veg'}`}></div>
          <span className="food-category">{item.category.replace('-', ' ')}</span>
          {item.isPopular && <span className="popular-tag">🔥 Popular</span>}
        </div>
        <h3 className="food-name">{item.name}</h3>
        <p className="food-desc">{item.description}</p>
        {item.rating > 0 && (
          <div className="food-rating">
            <span className="star">★</span>
            <span>{item.rating.toFixed(1)}</span>
            <span className="reviews">({item.totalReviews})</span>
          </div>
        )}
        <div className="food-footer">
          <span className="food-price">₹{item.price}</span>
          {qty === 0 ? (
            <button className={`btn btn-primary btn-sm add-btn ${adding ? 'added' : ''}`} onClick={handleAdd}>
              {adding ? '✓ Added' : '+ Add'}
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn minus" onClick={() => updateQuantity(item._id, qty - 1)}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn plus" onClick={() => updateQuantity(item._id, qty + 1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
