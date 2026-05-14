import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import RestaurantCard from '../components/food/RestaurantCard';
import './Restaurants.css';

const CATEGORIES = ['all', 'veg', 'non-veg', 'fast-food', 'pizza', 'dessert', 'beverages', 'starters', 'main-course'];

export default function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.set('search', search);
      if (selectedCategory !== 'all') params.set('cuisine', selectedCategory);
      if (showOpenOnly) params.set('isOpen', 'true');

      const { data } = await api.get(`/restaurants?${params}`);
      setRestaurants(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRestaurants(); }, [page, selectedCategory, showOpenOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRestaurants();
  };

  return (
    <div className="restaurants-page">
      <div className="restaurants-hero">
        <div className="container">
          <h1>Find Your Favorite Restaurant</h1>
          <form className="rest-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container restaurants-body">
        <aside className="filters-sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label className="filter-label">Cuisine Type</label>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
              >
                {cat === 'all' ? 'All Cuisines' : cat.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <label className="filter-toggle">
              <input type="checkbox" checked={showOpenOnly} onChange={e => setShowOpenOnly(e.target.checked)} />
              <span>Show Open Only</span>
            </label>
          </div>
        </aside>

        <div className="restaurants-content">
          <div className="results-header">
            <span className="results-count">{total} restaurant{total !== 1 ? 's' : ''} found</span>
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(9)].map((_, i) => (
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
          ) : restaurants.length === 0 ? (
            <div className="empty-state">
              <div style={{fontSize: '4rem', marginBottom: 16}}>🍽️</div>
              <h3>No restaurants found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCategory('all'); setShowOpenOnly(false); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
              </div>
              {total > 9 && (
                <div className="pagination">
                  <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <span className="page-info">Page {page} of {Math.ceil(total / 9)}</span>
                  <button className="btn btn-ghost" disabled={page >= Math.ceil(total / 9)} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
