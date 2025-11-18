import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  const loadCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await productAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    const params = {};
    if (newCategory) params.category = newCategory;
    if (search) params.search = search;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const selectedCategory = categories.find(c => c.slug === category);

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>{selectedCategory ? selectedCategory.name : search ? `Search: "${search}"` : 'All Plants'}</h1>
            {selectedCategory && <p>{selectedCategory.description}</p>}
            {(category || search) && (
              <button onClick={clearFilters} className="clear-filters">Clear Filters</button>
            )}
          </div>
        </div>

        <div className="products-layout">
          <aside className="filters-sidebar">
            <h3>Categories</h3>
            <div className="filter-list">
              <button
                className={`filter-item ${!category ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                All Plants
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-item ${category === cat.slug ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          <div className="products-content">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-count">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </div>
                <div className="grid grid-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
