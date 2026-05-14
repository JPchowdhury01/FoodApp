import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Admin.css';

const EMPTY_RESTAURANT = { name: '', description: '', location: { address: '', city: '', state: '', zipCode: '' }, cuisine: '', deliveryTime: '30-40 mins', deliveryFee: 30, minimumOrder: 100, image: '', isOpen: true };
const EMPTY_FOOD = { name: '', description: '', price: '', category: 'veg', restaurantId: '', image: '', isPopular: false, isBestSeller: false };

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showRestForm, setShowRestForm] = useState(false);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [editingRest, setEditingRest] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [restForm, setRestForm] = useState(EMPTY_RESTAURANT);
  const [foodForm, setFoodForm] = useState(EMPTY_FOOD);

  if (!user || !isAdmin) return <Navigate to="/" replace />;

  useEffect(() => { fetchAll(); }, [tab]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const { data } = await api.get('/admin/dashboard');
        setStats(data.data);
      } else if (tab === 'restaurants') {
        const { data } = await api.get('/restaurants?limit=50');
        setRestaurants(data.data);
      } else if (tab === 'food') {
        const [foodRes, restRes] = await Promise.all([
          api.get('/food?limit=100'),
          api.get('/restaurants?limit=50')
        ]);
        setFoodItems(foodRes.data.data);
        setRestaurants(restRes.data.data);
      } else if (tab === 'orders') {
        const { data } = await api.get('/orders/all?limit=50');
        setOrders(data.data);
      } else if (tab === 'users') {
        const { data } = await api.get('/admin/users');
        setUsers(data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Restaurant CRUD
  const handleRestSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...restForm, cuisine: restForm.cuisine.split(',').map(s => s.trim()).filter(Boolean) };
      if (editingRest) {
        await api.put(`/restaurants/${editingRest._id}`, payload);
        toast.success('Restaurant updated!');
      } else {
        await api.post('/restaurants', payload);
        toast.success('Restaurant created!');
      }
      setShowRestForm(false); setEditingRest(null); setRestForm(EMPTY_RESTAURANT);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDeleteRest = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    try { await api.delete(`/restaurants/${id}`); toast.success('Deleted!'); fetchAll(); }
    catch (err) { toast.error('Error deleting restaurant'); }
  };

  // Food CRUD
  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...foodForm, price: Number(foodForm.price) };
      if (editingFood) {
        await api.put(`/food/${editingFood._id}`, payload);
        toast.success('Food item updated!');
      } else {
        await api.post('/food', payload);
        toast.success('Food item created!');
      }
      setShowFoodForm(false); setEditingFood(null); setFoodForm(EMPTY_FOOD);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await api.delete(`/food/${id}`); toast.success('Deleted!'); fetchAll(); }
    catch (err) { toast.error('Error deleting food item'); }
  };

  // Order status
  const handleOrderStatus = async (id, status) => {
    try { await api.put(`/orders/${id}/status`, { status }); toast.success('Status updated!'); fetchAll(); }
    catch (err) { toast.error('Error updating order'); }
  };

  // User toggle
  const handleToggleUser = async (id) => {
    try { await api.put(`/admin/users/${id}/toggle`); toast.success('User status toggled!'); fetchAll(); }
    catch (err) { toast.error('Error toggling user'); }
  };

  const TABS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'restaurants', label: '🏪 Restaurants' },
    { id: 'food', label: '🍔 Food Items' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'users', label: '👥 Users' },
  ];

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">⚙️ Admin Panel</div>
        {TABS.map(t => (
          <button key={t.id} className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="fade-in">
            <h2 className="admin-section-title">Dashboard Overview</h2>
            {loading ? <div className="spinner" style={{ margin: '60px auto' }}></div> : stats && (
              <>
                <div className="stats-grid">
                  {[
                    { label: 'Total Users', value: stats.stats.totalUsers, icon: '👥', color: '#3B82F6' },
                    { label: 'Restaurants', value: stats.stats.totalRestaurants, icon: '🏪', color: '#8B5CF6' },
                    { label: 'Total Orders', value: stats.stats.totalOrders, icon: '📦', color: '#F59E0B' },
                    { label: 'Revenue', value: `₹${stats.stats.totalRevenue?.toLocaleString('en-IN')}`, icon: '💰', color: '#10B981' },
                  ].map((s, i) => (
                    <div key={i} className="stat-card card" style={{ '--accent-color': s.color }}>
                      <div className="stat-icon">{s.icon}</div>
                      <div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dashboard-bottom">
                  <div className="card recent-orders-card">
                    <h3>Recent Orders</h3>
                    {stats.recentOrders?.map(o => (
                      <div key={o._id} className="recent-order-row">
                        <div>
                          <span className="recent-order-id">#{o._id.slice(-6).toUpperCase()}</span>
                          <span className="recent-order-user">{o.userId?.name}</span>
                        </div>
                        <div className="recent-order-right">
                          <span className="status-pill" data-status={o.status}>{o.status}</span>
                          <span>₹{o.grandTotal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card orders-by-status-card">
                    <h3>Orders by Status</h3>
                    {stats.ordersByStatus?.map(s => (
                      <div key={s._id} className="status-bar-row">
                        <span className="status-bar-label">{s._id}</span>
                        <div className="status-bar-wrap">
                          <div className="status-bar" style={{ width: `${Math.min(100, (s.count / stats.stats.totalOrders) * 100)}%` }}></div>
                        </div>
                        <span className="status-bar-count">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Restaurants Tab */}
        {tab === 'restaurants' && (
          <div className="fade-in">
            <div className="admin-tab-header">
              <h2 className="admin-section-title">Restaurants</h2>
              <button className="btn btn-primary btn-sm" onClick={() => { setShowRestForm(true); setEditingRest(null); setRestForm(EMPTY_RESTAURANT); }}>
                + Add Restaurant
              </button>
            </div>

            {showRestForm && (
              <div className="card admin-form-card">
                <h3>{editingRest ? 'Edit Restaurant' : 'New Restaurant'}</h3>
                <form onSubmit={handleRestSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={restForm.name} onChange={e => setRestForm(p => ({ ...p, name: e.target.value }))} required /></div>
                    <div className="form-group"><label className="form-label">Image URL</label><input className="form-control" value={restForm.image} onChange={e => setRestForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><input className="form-control" value={restForm.description} onChange={e => setRestForm(p => ({ ...p, description: e.target.value }))} /></div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Street Address</label><input className="form-control" value={restForm.location.address} onChange={e => setRestForm(p => ({ ...p, location: { ...p.location, address: e.target.value } }))} /></div>
                    <div className="form-group"><label className="form-label">City *</label><input className="form-control" value={restForm.location.city} onChange={e => setRestForm(p => ({ ...p, location: { ...p.location, city: e.target.value } }))} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Cuisine (comma-separated)</label><input className="form-control" value={restForm.cuisine} onChange={e => setRestForm(p => ({ ...p, cuisine: e.target.value }))} placeholder="Indian, Chinese" /></div>
                    <div className="form-group"><label className="form-label">Delivery Time</label><input className="form-control" value={restForm.deliveryTime} onChange={e => setRestForm(p => ({ ...p, deliveryTime: e.target.value }))} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Delivery Fee (₹)</label><input className="form-control" type="number" value={restForm.deliveryFee} onChange={e => setRestForm(p => ({ ...p, deliveryFee: Number(e.target.value) }))} /></div>
                    <div className="form-group"><label className="form-label">Min Order (₹)</label><input className="form-control" type="number" value={restForm.minimumOrder} onChange={e => setRestForm(p => ({ ...p, minimumOrder: Number(e.target.value) }))} /></div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => { setShowRestForm(false); setEditingRest(null); }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingRest ? 'Update' : 'Create'} Restaurant</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? <div className="spinner" style={{ margin: '40px auto' }}></div> : (
              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead><tr><th>Restaurant</th><th>City</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {restaurants.map(r => (
                      <tr key={r._id}>
                        <td><div className="table-name-cell"><img src={r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50'} alt="" onError={e => { e.target.style.display = 'none'; }} /><span>{r.name}</span></div></td>
                        <td>{r.location?.city}</td>
                        <td>★ {r.rating?.toFixed(1)}</td>
                        <td><span className={`table-status ${r.isOpen ? 'open' : 'closed'}`}>{r.isOpen ? 'Open' : 'Closed'}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => { setEditingRest(r); setRestForm({ ...r, cuisine: r.cuisine?.join(', ') || '' }); setShowRestForm(true); }}>Edit</button>
                            <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteRest(r._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Food Items Tab */}
        {tab === 'food' && (
          <div className="fade-in">
            <div className="admin-tab-header">
              <h2 className="admin-section-title">Food Items</h2>
              <button className="btn btn-primary btn-sm" onClick={() => { setShowFoodForm(true); setEditingFood(null); setFoodForm(EMPTY_FOOD); }}>
                + Add Food Item
              </button>
            </div>

            {showFoodForm && (
              <div className="card admin-form-card">
                <h3>{editingFood ? 'Edit Food Item' : 'New Food Item'}</h3>
                <form onSubmit={handleFoodSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={foodForm.name} onChange={e => setFoodForm(p => ({ ...p, name: e.target.value }))} required /></div>
                    <div className="form-group"><label className="form-label">Price (₹) *</label><input className="form-control" type="number" value={foodForm.price} onChange={e => setFoodForm(p => ({ ...p, price: e.target.value }))} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Restaurant *</label>
                      <select className="form-control" value={foodForm.restaurantId} onChange={e => setFoodForm(p => ({ ...p, restaurantId: e.target.value }))} required>
                        <option value="">Select Restaurant</option>
                        {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-control" value={foodForm.category} onChange={e => setFoodForm(p => ({ ...p, category: e.target.value }))}>
                        {['veg','non-veg','vegan','fast-food','dessert','beverages','starters','main-course','breads','rice','noodles','pizza','burgers','seafood'].map(c => (
                          <option key={c} value={c}>{c.replace('-', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><input className="form-control" value={foodForm.description} onChange={e => setFoodForm(p => ({ ...p, description: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Image URL</label><input className="form-control" value={foodForm.image} onChange={e => setFoodForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
                  <div className="form-row">
                    <label className="checkbox-label"><input type="checkbox" checked={foodForm.isPopular} onChange={e => setFoodForm(p => ({ ...p, isPopular: e.target.checked }))} /> Mark as Popular</label>
                    <label className="checkbox-label"><input type="checkbox" checked={foodForm.isBestSeller} onChange={e => setFoodForm(p => ({ ...p, isBestSeller: e.target.checked }))} /> Mark as Bestseller</label>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => { setShowFoodForm(false); setEditingFood(null); }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingFood ? 'Update' : 'Create'} Item</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? <div className="spinner" style={{ margin: '40px auto' }}></div> : (
              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead><tr><th>Item</th><th>Restaurant</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
                  <tbody>
                    {foodItems.map(f => (
                      <tr key={f._id}>
                        <td><div className="table-name-cell"><img src={f.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=50'} alt="" onError={e => { e.target.style.display = 'none'; }} /><span>{f.name}</span></div></td>
                        <td>{f.restaurantId?.name || '—'}</td>
                        <td><span className="cat-pill">{f.category}</span></td>
                        <td>₹{f.price}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => { setEditingFood(f); setFoodForm({ ...f, restaurantId: f.restaurantId?._id || f.restaurantId }); setShowFoodForm(true); }}>Edit</button>
                            <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleDeleteFood(f._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="fade-in">
            <h2 className="admin-section-title">All Orders</h2>
            {loading ? <div className="spinner" style={{ margin: '40px auto' }}></div> : (
              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Restaurant</th><th>Amount</th><th>Status</th><th>Update Status</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td className="order-id-cell">#{o._id.slice(-8).toUpperCase()}</td>
                        <td>{o.userId?.name || '—'}<br /><small>{o.userId?.email}</small></td>
                        <td>{o.restaurantId?.name || '—'}</td>
                        <td>₹{o.grandTotal}</td>
                        <td><span className="status-pill" data-status={o.status}>{o.status}</span></td>
                        <td>
                          <select className="form-control" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            value={o.status}
                            onChange={e => handleOrderStatus(o._id, e.target.value)}>
                            {['pending','confirmed','preparing','out-for-delivery','delivered','cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="fade-in">
            <h2 className="admin-section-title">All Users</h2>
            {loading ? <div className="spinner" style={{ margin: '40px auto' }}></div> : (
              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`role-pill ${u.role}`}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                        <td><span className={`table-status ${u.isActive ? 'open' : 'closed'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          {u.role !== 'admin' && (
                            <button className="btn btn-ghost btn-sm" onClick={() => handleToggleUser(u._id)}>
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
