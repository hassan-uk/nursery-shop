import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge pending';
      case 'processing':
        return 'status-badge processing';
      case 'shipped':
        return 'status-badge shipped';
      case 'delivered':
        return 'status-badge delivered';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Start shopping and your orders will appear here</p>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-number">Order #{order.orderNumber}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <span className={getStatusBadgeClass(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="order-body">
                <div className="order-details">
                  <div className="detail-item">
                    <span className="detail-label">Total Amount</span>
                    <span className="detail-value">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment</span>
                    <span className="detail-value">Cash on Delivery</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Delivery Address</span>
                    <span className="detail-value">
                      {order.shippingAddress}, {order.shippingCity}
                    </span>
                  </div>
                </div>

                <Link to={`/order-confirmation/${order.id}`} className="btn btn-outline view-order-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
