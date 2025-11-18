import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    if (user) {
      setFormData({
        shippingAddress: user.address || '',
        shippingCity: user.city || '',
        shippingPostalCode: user.postalCode || '',
        phone: user.phone || '',
        notes: '',
      });
    }
  }, [user, isAuthenticated, cart.items, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingPostalCode || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await orderAPI.create(formData);
      await clearCart();
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2>Shipping Information</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label htmlFor="shippingAddress">Address *</label>
                  <input
                    type="text"
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="shippingCity">City *</label>
                    <input
                      type="text"
                      id="shippingCity"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingPostalCode">Postal Code *</label>
                    <input
                      type="text"
                      id="shippingPostalCode"
                      name="shippingPostalCode"
                      value={formData.shippingPostalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Contact number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Order Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    checked
                    readOnly
                  />
                  <label htmlFor="cod">
                    <strong>Cash on Delivery</strong>
                    <span>Pay when you receive your order</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary place-order-btn" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="order-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                    </div>
                    <div className="item-price">${item.subtotal.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
