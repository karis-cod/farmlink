import { useState } from 'react';
import { mockNegotiations, mockFarmers } from '../data/mockData';
import type { Negotiation } from '../types';
import './NegotiationPage.css';

export function NegotiationPage() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>(mockNegotiations);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedNegotiationId, setSelectedNegotiationId] = useState<string | null>(null);
  const [newProposedPrice, setNewProposedPrice] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState(mockFarmers[1].id);
  const [selectedProductId, setSelectedProductId] = useState('p4');

  const selectedFarmer = mockFarmers.find((f) => f.id === selectedFarmerId);
  const selectedProduct = selectedFarmer?.products.find((p) => p.id === selectedProductId);

  const handleCreateNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer || !selectedProduct || !newProposedPrice || !newQuantity) return;

    const newNegotiation: Negotiation = {
      id: `neg-${Date.now()}`,
      farmerId: selectedFarmerId,
      farmerName: selectedFarmer.name,
      productId: selectedProductId,
      productName: selectedProduct.name,
      originalPrice: selectedProduct.price,
      proposedPrice: parseFloat(newProposedPrice),
      quantity: parseInt(newQuantity),
      status: 'pending',
      messages: [],
      createdAt: new Date(),
    };

    setNegotiations([...negotiations, newNegotiation]);
    setNewProposedPrice('');
    setNewQuantity('');
    setShowNewForm(false);
  };

  const handleAccept = (id: string) => {
    setNegotiations(
      negotiations.map((neg) =>
        neg.id === id ? { ...neg, status: 'accepted' as const } : neg
      )
    );
  };

  const handleReject = (id: string) => {
    setNegotiations(
      negotiations.map((neg) =>
        neg.id === id ? { ...neg, status: 'rejected' as const } : neg
      )
    );
  };

  const totalSavings = negotiations.reduce((sum, neg) => {
    if (neg.status === 'accepted') {
      const saved = (neg.originalPrice - neg.proposedPrice) * neg.quantity;
      return sum + saved;
    }
    return sum;
  }, 0);

  return (
    <div className="negotiation-page">
      <div className="negotiation-header">
        <h1>💰 Price Negotiations</h1>
        <p>Negotiate prices with local farmers for better deals</p>
      </div>

      <div className="negotiation-stats">
        <div className="stat-card">
          <span className="stat-label">Active Negotiations</span>
          <span className="stat-value">{negotiations.filter((n) => n.status === 'pending').length}</span>
        </div>
        <div className="stat-card success">
          <span className="stat-label">Accepted Deals</span>
          <span className="stat-value">{negotiations.filter((n) => n.status === 'accepted').length}</span>
        </div>
        <div className="stat-card savings">
          <span className="stat-label">Total Savings</span>
          <span className="stat-value">${totalSavings.toFixed(2)}</span>
        </div>
      </div>

      <div className="negotiation-container">
        <button
          className="new-negotiation-btn"
          onClick={() => setShowNewForm(!showNewForm)}
        >
          {showNewForm ? '✕ Cancel' : '+ New Negotiation'}
        </button>

        {showNewForm && (
          <form className="new-negotiation-form" onSubmit={handleCreateNegotiation}>
            <h3>Create New Negotiation</h3>

            <div className="form-group">
              <label>Select Farmer</label>
              <select
                value={selectedFarmerId}
                onChange={(e) => {
                  setSelectedFarmerId(e.target.value);
                  const farmer = mockFarmers.find((f) => f.id === e.target.value);
                  if (farmer?.products.length) {
                    setSelectedProductId(farmer.products[0].id);
                  }
                }}
                className="form-select"
              >
                {mockFarmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedFarmer && (
              <div className="form-group">
                <label>Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="form-select"
                >
                  {selectedFarmer.products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (${product.price.toFixed(2)}/{product.unit})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedProduct && (
              <>
                <div className="form-group">
                  <label>Quantity ({selectedProduct.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder={`Max: ${selectedProduct.quantity}`}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Proposed Price (per {selectedProduct.unit})</label>
                  <div className="price-input-group">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={selectedProduct.price}
                      value={newProposedPrice}
                      onChange={(e) => setNewProposedPrice(e.target.value)}
                      placeholder={`Original: $${selectedProduct.price.toFixed(2)}`}
                      className="form-input"
                      required
                    />
                  </div>
                  {newProposedPrice && parseFloat(newProposedPrice) < selectedProduct.price && (
                    <p className="price-savings">
                      💰 You'll save ${((selectedProduct.price - parseFloat(newProposedPrice)) * parseInt(newQuantity || '1')).toFixed(2)} if accepted!
                    </p>
                  )}
                </div>

                <button type="submit" className="submit-btn">
                  Send Negotiation Offer
                </button>
              </>
            )}
          </form>
        )}

        <div className="negotiations-list">
          {negotiations.length === 0 ? (
            <div className="no-negotiations">
              <p>📦 No negotiations yet</p>
              <p>Start by creating a new negotiation offer</p>
            </div>
          ) : (
            <>
              {negotiations.filter((n) => n.status === 'pending').length > 0 && (
                <div className="negotiation-section">
                  <h3>Pending Negotiations</h3>
                  {negotiations
                    .filter((n) => n.status === 'pending')
                    .map((negotiation) => (
                      <div
                        key={negotiation.id}
                        className="negotiation-card pending"
                        onClick={() =>
                          setSelectedNegotiationId(
                            selectedNegotiationId === negotiation.id ? null : negotiation.id
                          )
                        }
                      >
                        <div className="negotiation-card-header">
                          <div className="negotiation-info">
                            <h4>{negotiation.productName}</h4>
                            <p className="farmer-name">From: {negotiation.farmerName}</p>
                          </div>
                          <span className="status-badge pending">⏳ Pending</span>
                        </div>

                        {selectedNegotiationId === negotiation.id && (
                          <div className="negotiation-details">
                            <div className="details-row">
                              <span>Quantity:</span>
                              <strong>{negotiation.quantity}</strong>
                            </div>
                            <div className="details-row">
                              <span>Original Price:</span>
                              <strong>${negotiation.originalPrice.toFixed(2)}</strong>
                            </div>
                            <div className="details-row">
                              <span>Your Offer:</span>
                              <strong>${negotiation.proposedPrice.toFixed(2)}</strong>
                            </div>
                            <div className="details-row savings">
                              <span>Per-unit Savings:</span>
                              <strong>${(negotiation.originalPrice - negotiation.proposedPrice).toFixed(2)}</strong>
                            </div>
                            <div className="details-row total">
                              <span>Total Savings:</span>
                              <strong>${((negotiation.originalPrice - negotiation.proposedPrice) * negotiation.quantity).toFixed(2)}</strong>
                            </div>

                            <div className="negotiation-actions">
                              <button
                                className="action-btn accept"
                                onClick={() => handleAccept(negotiation.id)}
                              >
                                ✓ Accept
                              </button>
                              <button
                                className="action-btn reject"
                                onClick={() => handleReject(negotiation.id)}
                              >
                                ✕ Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {negotiations.filter((n) => n.status !== 'pending').length > 0 && (
                <div className="negotiation-section">
                  <h3>Completed Negotiations</h3>
                  {negotiations
                    .filter((n) => n.status !== 'pending')
                    .map((negotiation) => (
                      <div
                        key={negotiation.id}
                        className={`negotiation-card ${negotiation.status}`}
                      >
                        <div className="negotiation-card-header">
                          <div className="negotiation-info">
                            <h4>{negotiation.productName}</h4>
                            <p className="farmer-name">From: {negotiation.farmerName}</p>
                          </div>
                          <span className={`status-badge ${negotiation.status}`}>
                            {negotiation.status === 'accepted' ? '✓ Accepted' : '✕ Rejected'}
                          </span>
                        </div>
                        <div className="negotiation-summary">
                          <span>${negotiation.proposedPrice.toFixed(2)}</span>
                          <span>×</span>
                          <span>{negotiation.quantity}</span>
                          <span>=</span>
                          <strong>
                            ${(negotiation.proposedPrice * negotiation.quantity).toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
