import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import './Orders.css';

const STATUS_COLORS = {
  pending: { bg: '#FEF3C7', color: '#92400E', label: '⏳ Pending' },
  confirmed: { bg: '#DBEAFE', color: '#1E40AF', label: '✅ Confirmed' },
  preparing: { bg: '#EDE9FE', color: '#5B21B6', label: '👨‍🍳 Preparing' },
  'out-for-delivery': { bg: '#D1FAE5', color: '#065F46', label: '🛵 Out for Delivery' },
  delivered: { bg: '#D1FAE5', color: '#065F46', label: '🎉 Delivered' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B', label: '❌ Cancelled' },
};

const STEPS = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];

function OrderTracker({ status }) {
  const currentIdx = STEPS.indexOf(status);
  if (status === 'cancelled') return (
    <div className="tracker-cancelled">❌ This order was cancelled</div>
  );
  return (
    <div className="order-tracker">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`tracker-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'active' : ''}`}>
            <div className="tracker-dot">
              {i < currentIdx ? '✓' : i === currentIdx ? '●' : ''}
            </div>
            <span className="tracker-label">{STATUS_COLORS[step]?.label.replace(/^[^\s]+\s/, '')}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`tracker-line ${i < currentIdx ? 'done' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!order) return <div className="page-loader"><p>Order not found</p></div>;

  const statusInfo = STATUS_COLORS[order.status];
  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="order-detail-page fade-in">
      <div className="container">
        <Link to="/orders" className="back-link">← Back to Orders</Link>
        <div className="order-detail-grid">
          <div className="order-main">
            <div className="card order-status-card">
              <div className="order-status-header">
                <div>
                  <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                  <p className="order-date">{orderDate}</p>
                </div>
                <span className="status-badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                  {statusInfo.label}
                </span>
              </div>
              <OrderTracker status={order.status} />
              {order.estimatedDeliveryTime && order.status !== 'delivered' && order.status !== 'cancelled' && (
                <p className="estimated-time">⏱️ Estimated delivery: <strong>{order.estimatedDeliveryTime}</strong></p>
              )}
            </div>

            <div className="card order-items-card">
              <h3>Items Ordered</h3>
              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="order-item-img"
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div className="order-item-info">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">× {item.quantity}</span>
                  </div>
                  <span className="order-item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="card delivery-info-card">
              <h3>📍 Delivery Address</h3>
              <p>{order.deliveryAddress?.street}</p>
              <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}</p>
              {order.specialInstructions && (
                <p className="special-note"><em>Note: {order.specialInstructions}</em></p>
              )}
            </div>
          </div>

          <div className="order-sidebar">
            <div className="card order-summary-card">
              <h3>Bill Summary</h3>
              <div className="bill-row"><span>Subtotal</span><span>₹{order.totalAmount}</span></div>
              <div className="bill-row"><span>Delivery Fee</span><span>₹{order.deliveryFee}</span></div>
              <div className="bill-row"><span>Taxes</span><span>₹{order.taxes}</span></div>
              <div className="bill-divider"></div>
              <div className="bill-row total"><span>Total Paid</span><span>₹{order.grandTotal}</span></div>
              <div className="bill-row">
                <span>Payment</span>
                <span className="payment-label">{order.paymentMethod.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
              </div>
              <div className="bill-row">
                <span>Payment Status</span>
                <span className={`payment-status ${order.paymentStatus}`}>{order.paymentStatus}</span>
              </div>
            </div>

            {order.restaurantId && (
              <div className="card restaurant-ref-card">
                <h3>🍴 Restaurant</h3>
                <Link to={`/restaurants/${order.restaurantId._id}`} className="restaurant-ref-link">
                  <strong>{order.restaurantId.name}</strong>
                  {order.restaurantId.location?.city && <span> · {order.restaurantId.location.city}</span>}
                </Link>
              </div>
            )}

            <div className="status-history card">
              <h3>Status History</h3>
              {order.statusHistory?.slice().reverse().map((h, i) => (
                <div key={i} className="history-item">
                  <span className="history-status">{STATUS_COLORS[h.status]?.label || h.status}</span>
                  <span className="history-time">{new Date(h.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get(`/orders/my-orders?page=${page}&limit=8`);
        setOrders(data.data);
        setTotalPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="orders-page fade-in">
      <div className="container">
        <h1 className="page-heading">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📦</div>
            <h3>No orders yet</h3>
            <p>Start by ordering from your favourite restaurant</p>
            <Link to="/" className="btn btn-primary">Order Now</Link>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map(order => {
                const statusInfo = STATUS_COLORS[order.status];
                return (
                  <Link key={order._id} to={`/orders/${order._id}`} className="order-card card">
                    <div className="order-card-left">
                      {order.restaurantId?.image && (
                        <img src={order.restaurantId.image} alt={order.restaurantId.name} className="order-rest-img"
                          onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      <div>
                        <h3 className="order-rest-name">{order.restaurantId?.name || 'Restaurant'}</h3>
                        <p className="order-items-preview">
                          {order.items.slice(0, 2).map(i => i.name).join(', ')}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </p>
                        <p className="order-date-small">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="order-card-right">
                      <span className="status-badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                      <p className="order-total">₹{order.grandTotal}</p>
                      <span className="view-details">View Details →</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="page-info">Page {page} of {totalPages}</span>
                <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
