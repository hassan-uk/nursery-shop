import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="empty-state">
        <h3>Order not found</h3>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-box">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="confirmation-message">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          <div className="order-number">
            <span className="label">Order Number:</span>
            <span className="value">{order.orderNumber}</span>
          </div>

          <div className="order-details-card">
            <h2>Order Details</h2>

            <div className="detail-section">
              <h3>Shipping Information</h3>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingPostalCode}</p>
              <p>Phone: {order.phone}</p>
            </div>

            <div className="detail-section">
              <h3>Payment Method</h3>
              <p>Cash on Delivery</p>
            </div>

            <div className="detail-section">
              <h3>Order Items</h3>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-details">
                      <span className="item-name">{item.productName}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-total">
              <span>Total Amount</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="btn btn-primary">View All Orders</Link>
            <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
