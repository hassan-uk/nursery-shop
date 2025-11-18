import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update cart:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state">
            <h2>Please sign in to view your cart</h2>
            <p>You need to be logged in to add items to your cart</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Start adding some plants to your cart</p>
            <Link to="/products" className="btn btn-primary">Shop Plants</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <Link to={`/product/${item.productId}`} className="item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </Link>

                <div className="item-details">
                  <Link to={`/product/${item.productId}`} className="item-name">
                    {item.name}
                  </Link>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  {item.stock < 10 && (
                    <div className="stock-warning">Only {item.stock} left in stock</div>
                  )}
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItems[item.id]}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        handleQuantityChange(item.id, Math.min(item.stock, Math.max(1, val)));
                      }}
                      min="1"
                      max={item.stock}
                      disabled={updatingItems[item.id]}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock || updatingItems[item.id]}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-subtotal">
                  ${item.subtotal.toFixed(2)}
                </div>

                <button
                  className="item-remove"
                  onClick={() => handleRemove(item.id)}
                  disabled={updatingItems[item.id]}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.items.length} items)</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
