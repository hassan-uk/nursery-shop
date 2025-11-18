import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll({ featured: 'true' }),
        productAPI.getCategories(),
      ]);
      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bring Nature Home</h1>
            <p>Discover a wide selection of healthy plants for your space</p>
            <Link to="/products" className="btn btn-primary">Shop All Plants</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Find the perfect plants for every space and occasion</p>
          </div>
          <div className="grid grid-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Plants</h2>
            <p>Handpicked favorites from our collection</p>
          </div>
          <div className="grid grid-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="section-footer">
            <Link to="/products" className="btn btn-outline">View All Plants</Link>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Get your plants delivered quickly and safely</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🌱</div>
              <h3>Healthy Plants</h3>
              <p>All plants are carefully inspected before shipping</p>
            </div>
            <div className="info-card">
              <div className="info-icon">💚</div>
              <h3>Expert Support</h3>
              <p>Get help from our plant care specialists</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
