import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockFarmers } from '../data/mockData';
import type { Farmer } from '../types';
import './HomePage.css';

export function HomePage() {
  const [search, setSearch] = useState('');

  const filteredFarmers = mockFarmers.filter((farmer) => {
    if (!search.trim()) {
      return true;
    }
    const query = search.toLowerCase();
    return (
      farmer.name.toLowerCase().includes(query) ||
      farmer.location.toLowerCase().includes(query) ||
      farmer.products.some((product) => product.name.toLowerCase().includes(query))
    );
  });

  return (
    <main className="home-page">
      <section className="home-hero">
        <div>
          <p className="eyebrow">Farm marketplace</p>
          <h1>Find local farmers and fresh produce</h1>
          <p className="hero-copy">Search products, compare ratings, and chat with farmers instantly.</p>
        </div>
        <div className="search-wrap">
          <label htmlFor="search" className="search-label">
            Search farmers or products
          </label>
          <input
            id="search"
            type="text"
            placeholder="Type eggs, milk, berries..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="search-input"
          />
        </div>
      </section>

      <section className="cards-section">
        {filteredFarmers.length > 0 ? (
          <div className="cards-grid">
            {filteredFarmers.map((farmer: Farmer) => {
              const defaultProduct = farmer.products[0];
              return (
                <article key={farmer.id} className="farmer-card">
                  <div className="card-top">
                    <div>
                      <div className="farmer-name">{farmer.name}</div>
                      <div className="product-name">{defaultProduct?.name ?? 'Fresh produce'}</div>
                    </div>
                    <span className="rating">⭐ {farmer.rating.toFixed(1)}</span>
                  </div>
                  <p className="product-description">{defaultProduct?.description ?? 'Connect with this farmer to learn more.'}</p>
                  <div className="card-bottom">
                    <span className="price">${defaultProduct?.price.toFixed(2) ?? '—'}/{defaultProduct?.unit ?? 'item'}</span>
                    <Link
                      to={`/chat?farmer=${farmer.id}&product=${defaultProduct?.id}`}
                      className="chat-button"
                    >
                      Chat
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No farmers found for "{search}".</p>
            <p>Try searching for eggs, milk, berries, or another product.</p>
          </div>
        )}
      </section>
    </main>
  );
}
