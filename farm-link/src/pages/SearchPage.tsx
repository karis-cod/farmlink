import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockFarmers } from '../data/mockData';
import type { Product } from '../types';
import './SearchPage.css';

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Flatten all products from all farmers
  const allProducts: (Product & { farmerName: string; farmerId: string })[] = mockFarmers.flatMap((farmer) =>
    farmer.products.map((product) => ({
      ...product,
      farmerName: farmer.name,
      farmerId: farmer.id,
    }))
  );

  // Get unique categories
  const categories = ['All', ...new Set(allProducts.map((p) => p.category))];

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>🔍 Find Fresh Products</h1>
        <p>Search from local farms and get the freshest produce delivered</p>
      </div>

      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products, farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="search-results">
        {filteredProducts.length > 0 ? (
          <>
            <p className="results-count">Found {filteredProducts.length} product(s)</p>
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={`${product.farmerId}-${product.id}`}
                  to={`/chat?farmer=${product.farmerId}&product=${product.id}`}
                  className="product-card"
                >
                  <div className="product-emoji">📦</div>
                  <h3>{product.name}</h3>
                  <p className="category-tag">{product.category}</p>
                  <p className="farmer-name">{product.farmerName}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <span className="unit">/{product.unit}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>😔 No products found</p>
            <p>Try adjusting your search or category filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
