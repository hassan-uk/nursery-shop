import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/products?category=${category.slug}`} className="category-card">
      <div className="category-image">
        <img src={category.imageUrl} alt={category.name} />
      </div>
      <div className="category-info">
        <h3 className="category-name">{category.name}</h3>
        <p className="category-description">{category.description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
