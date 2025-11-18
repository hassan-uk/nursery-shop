import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getBySlug(slug);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
      setMessage('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.stock < quantity) {
      setMessage('Not enough stock available');
      return;
    }

    try {
      setAddingToCart(true);
      setMessage('');
      await addToCart(product.id, quantity);
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="empty-state">
        <h3>Product not found</h3>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-layout">
          <div className="product-image-large">
            <img src={product.imageUrl} alt={product.name} />
          </div>

          <div className="product-details-section">
            <div className="breadcrumb">
              <a href="/products">All Plants</a>
              {product.category && (
                <>
                  <span> / </span>
                  <a href={`/products?category=${product.category.slug}`}>
                    {product.category.name}
                  </a>
                </>
              )}
            </div>

            <h1>{product.name}</h1>
            {product.botanicalName && (
              <p className="botanical-name">{product.botanicalName}</p>
            )}

            <div className="price-section">
              <span className="price">${product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="stock in-stock">In Stock</span>
              ) : (
                <span className="stock out-of-stock">Out of Stock</span>
              )}
            </div>

            <p className="description">{product.description}</p>

            {(product.careLevel || product.sunlight || product.waterNeeds || product.height) && (
              <div className="care-info">
                <h3>Plant Care Information</h3>
                <div className="care-grid">
                  {product.careLevel && (
                    <div className="care-item">
                      <span className="care-label">Care Level</span>
                      <span className="care-value">{product.careLevel}</span>
                    </div>
                  )}
                  {product.sunlight && (
                    <div className="care-item">
                      <span className="care-label">Sunlight</span>
                      <span className="care-value">{product.sunlight}</span>
                    </div>
                  )}
                  {product.waterNeeds && (
                    <div className="care-item">
                      <span className="care-label">Water Needs</span>
                      <span className="care-value">{product.waterNeeds}</span>
                    </div>
                  )}
                  {product.height && (
                    <div className="care-item">
                      <span className="care-label">Height</span>
                      <span className="care-value">{product.height}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
