import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
        {product.isFeatured && <span className="featured-badge">Featured</span>}
        {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.botanicalName && (
          <p className="product-botanical">{product.botanicalName}</p>
        )}
        <div className="product-details">
          {product.careLevel && (
            <span className="product-tag">{product.careLevel}</span>
          )}
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {product.stock > 0 && product.stock < 10 && (
            <span className="stock-warning">Only {product.stock} left</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
