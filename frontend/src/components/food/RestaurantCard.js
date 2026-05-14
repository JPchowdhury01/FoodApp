import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

export default function RestaurantCard({ restaurant }) {
  const { _id, name, image, rating, totalReviews, deliveryTime, deliveryFee, minimumOrder, cuisine, isOpen, tags } = restaurant;

  return (
    <Link to={`/restaurants/${_id}`} className="restaurant-card card">
      <div className="restaurant-img-wrap">
        <img
          src={image || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400`}
          alt={name}
          className="restaurant-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'; }}
        />
        <div className={`open-badge ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? '● Open' : '● Closed'}
        </div>
        {tags?.includes('trending') && <div className="tag-badge trending">🔥 Trending</div>}
        {tags?.includes('bestseller') && <div className="tag-badge bestseller">⭐ Bestseller</div>}
      </div>
      <div className="restaurant-info">
        <div className="restaurant-header">
          <h3 className="restaurant-name">{name}</h3>
          <div className="restaurant-rating">
            <span className="star">★</span>
            <span className="rating-val">{rating?.toFixed(1) || '4.0'}</span>
            <span className="reviews">({totalReviews || 0})</span>
          </div>
        </div>
        <p className="restaurant-cuisine">{cuisine?.join(' • ') || 'Multi-cuisine'}</p>
        <div className="restaurant-meta">
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {deliveryTime || '30-40 mins'}
          </span>
          <span className="meta-dot">·</span>
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            {deliveryFee === 0 ? 'Free delivery' : `₹${deliveryFee} delivery`}
          </span>
          {minimumOrder > 0 && <>
            <span className="meta-dot">·</span>
            <span className="meta-item">Min ₹{minimumOrder}</span>
          </>}
        </div>
      </div>
    </Link>
  );
}
