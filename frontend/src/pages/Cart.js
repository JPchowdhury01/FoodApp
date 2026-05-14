import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { cartItems, cartRestaurant, totalAmount, deliveryFee, taxes, grandTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');
  const [address, setAddress] = useState({ street: '', city: 'Bengaluru', state: 'Karnataka', zipCode: '' });
  const [instructions, setInstructions] = useState('');

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city) { toast.error('Please enter a delivery address'); return; }
    setPlacing(true);
    try {
      const orderData = {
        restaurantId: cartRestaurant._id,
        items: cartItems.map(i => ({ foodItem: i._id, quantity: i.quantity })),
        deliveryAddress: address,
        paymentMethod,
        specialInstructions: instructions
      };
      const { data } = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-state">
          <div style={{fontSize: '5rem', marginBottom: 16}}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items to your cart</p>
          <Link to="/" className="btn btn-primary btn-lg">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page fade-in">
      <div className="container">
        <h1 className="cart-title">Your Cart</h1>
        {cartRestaurant && (
          <p className="cart-restaurant">
            🍴 Ordering from <Link to={`/restaurants/${cartRestaurant._id}`}>{cartRestaurant.name}</Link>
          </p>
        )}

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <h3>Items ({cartItems.length})</h3>
              <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear All</button>
            </div>

            {cartItems.map(item => (
              <div key={item._id} className="cart-item card">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100'}
                  alt={item.name}
                  className="cart-item-img"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100'; }}
                />
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <span className="cart-item-price">₹{item.price} each</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button className="qty-btn minus" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn plus" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-total">₹{item.price * item.quantity}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)} title="Remove item">✕</button>
                </div>
              </div>
            ))}

            {/* Delivery address */}
            <div className="card delivery-form">
              <h3>📍 Delivery Address</h3>
              <div className="form-group">
                <input className="form-control" placeholder="Street address *" value={address.street} onChange={e => setAddress(p => ({...p, street: e.target.value}))} />
              </div>
              <div className="grid-2">
                <input className="form-control" placeholder="City *" value={address.city} onChange={e => setAddress(p => ({...p, city: e.target.value}))} />
                <input className="form-control" placeholder="ZIP Code" value={address.zipCode} onChange={e => setAddress(p => ({...p, zipCode: e.target.value}))} />
              </div>
              <div className="form-group" style={{marginTop: 12}}>
                <textarea className="form-control" placeholder="Special instructions (optional)..." value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="order-summary card">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? <span className="free">FREE</span> : `₹${deliveryFee}`}</span>
            </div>
            <div className="summary-row">
              <span>Taxes (5%)</span>
              <span>₹{taxes}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <div className="payment-section">
              <h4>Payment Method</h4>
              {[
                { value: 'cash-on-delivery', label: '💵 Cash on Delivery' },
                { value: 'upi', label: '📱 UPI' },
                { value: 'card', label: '💳 Card' }
              ].map(opt => (
                <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={e => setPaymentMethod(e.target.value)} />
                  {opt.label}
                </label>
              ))}
            </div>

            {user ? (
              <button className="btn btn-primary btn-lg place-order-btn" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? <><span className="spinner" style={{width: 20, height: 20, borderWidth: 2}}></span> Placing...</> : `Place Order • ₹${grandTotal}`}
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg place-order-btn">Login to Place Order</Link>
            )}

            <p className="safe-note">🔒 Your order is secured with SSL encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}
