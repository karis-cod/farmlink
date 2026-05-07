import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockFarmers } from '../data/mockData';
import './FarmerListingPage.css';

export function FarmerListingPage() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const [expandedFarmerId, setExpandedFarmerId] = useState<string | null>(highlightId);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFarmers = useMemo(() => {
    return mockFarmers.filter(
      (farmer) =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.products.some((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm]);

  return (
    <div className="farmer-listing-page">
      <div className="listing-header">
        <h1>👨‍🌾 Local Farmers</h1>
        <p>Support local farming communities</p>
      </div>

      <div className="listing-search">
        <input
          type="text"
          placeholder="Search farmers or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="listing-search-input"
        />
      </div>

      <div className="farmers-list">
        {filteredFarmers.map((farmer) => (
          <div key={farmer.id} className="farmer-card">
            <div className="farmer-header" onClick={() => setExpandedFarmerId(expandedFarmerId === farmer.id ? null : farmer.id)}>
              <div className="farmer-info">
                <div className="farmer-emoji">{farmer.image || '🚜'}</div>
                <div className="farmer-details">
                  <h2>{farmer.name}</h2>
                  <p className="location">📍 {farmer.location}</p>
                  <p className="bio">{farmer.bio}</p>
                  <div className="farmer-stats">
                    <span className="rating">⭐ {farmer.rating} ({farmer.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <button className="expand-btn">
                {expandedFarmerId === farmer.id ? '−' : '+'}
              </button>
            </div>

            {expandedFarmerId === farmer.id && (
              <div className="farmer-products">
                <h3>Products Available</h3>
                <div className="products-list">
                  {farmer.products.map((product) => (
                    <div key={product.id} className="farmer-product-item">
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-cat">{product.category}</p>
                        <p className="product-desc">{product.description}</p>
                        <p className="stock">In stock: {product.quantity} {product.unit}</p>
                      </div>
                      <div className="product-action">
                        <div className="product-price">
                          <span className="price">${product.price.toFixed(2)}</span>
                          <span className="unit">/{product.unit}</span>
                        </div>
                        <Link
                          to={`/chat?farmer=${farmer.id}&product=${product.id}`}
                          className="contact-btn"
                        >
                          💬 Chat
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFarmers.length === 0 && (
        <div className="no-farmers">
          <p>😔 No farmers found</p>
        </div>
      )}
    </div>
  );
}
