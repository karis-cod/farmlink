import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockFarmers, mockChatMessages } from '../data/mockData';
import type { ChatMessage } from '../types';
import './ChatPage.css';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = () => setMatches(mediaQuery.matches);

    handler();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const selectedFarmerParam = searchParams.get('farmer') ?? undefined;
  const selectedProductId = searchParams.get('product') ?? undefined;
  const selectedFarmerId = selectedFarmerParam ?? (isDesktop ? mockFarmers[0].id : undefined);

  const selectedFarmer = useMemo(
    () => (selectedFarmerId ? mockFarmers.find((farmer) => farmer.id === selectedFarmerId) : undefined),
    [selectedFarmerId]
  );

  const selectedProduct = useMemo(
    () =>
      selectedFarmer?.products.find((product) => product.id === selectedProductId) ||
      selectedFarmer?.products[0],
    [selectedFarmer, selectedProductId]
  );

  const initialMessages = useMemo(
    () => mockChatMessages.filter((message) => message.farmerId === selectedFarmerId),
    [selectedFarmerId]
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFarmer) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      farmerId: selectedFarmerId!,
      farmerName: selectedFarmer.name,
      message: newMessage,
      timestamp: new Date(),
      productId: selectedProductId || undefined,
      productName: selectedProduct?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    window.setTimeout(() => {
      const farmerResponse: ChatMessage = {
        id: `msg-${Date.now()}-resp`,
        sender: 'farmer',
        farmerId: selectedFarmerId!,
        farmerName: selectedFarmer.name,
        message: `Thanks for your message! I'll get back to you shortly.`,
        timestamp: new Date(),
        productId: selectedProductId || undefined,
        productName: selectedProduct?.name,
      };
      setMessages((prev) => [...prev, farmerResponse]);
    }, 1000);
  };

  const handleBackToList = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('farmer');
    params.delete('product');
    setSearchParams(params);
  };

  const showListPanel = isDesktop || !selectedFarmerParam;
  const showChatPanel = isDesktop || Boolean(selectedFarmerParam);

  return (
    <div className="chat-page">
      <div className="chat-container">
        {showListPanel && (
          <aside className="chat-sidebar">
            <h3>Conversations</h3>
            <div className="farmers-menu">
              {mockFarmers.map((farmer) => (
                <Link
                  key={farmer.id}
                  to={`?farmer=${farmer.id}`}
                  className={`farmer-menu-item ${selectedFarmerId === farmer.id ? 'active' : ''}`}
                >
                  <div className="farmer-menu-emoji">{farmer.image || '🚜'}</div>
                  <div className="farmer-menu-info">
                    <div className="farmer-menu-name">{farmer.name}</div>
                    <div className="farmer-menu-location">{farmer.location}</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}

        {showChatPanel && (
          <main className="chat-main">
            {selectedFarmer ? (
              <>
                <div className="chat-header">
                  {!isDesktop && (
                    <button type="button" className="chat-back-btn" onClick={handleBackToList}>
                      ← Conversations
                    </button>
                  )}
                  <div className="chat-farmer-info">
                    <div className="chat-emoji">{selectedFarmer.image || '🚜'}</div>
                    <div>
                      <h2>{selectedFarmer.name}</h2>
                      <p>⭐ {selectedFarmer.rating} rating</p>
                    </div>
                  </div>
                  {selectedProduct && (
                    <div className="chat-product-info">
                      <span className="product-badge">📦 {selectedProduct.name}</span>
                    </div>
                  )}
                </div>

                <div className="messages-container">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>👋 Start a conversation!</p>
                      <p>Send a message to {selectedFarmer.name}</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`message ${msg.sender}`}>
                        <div className="message-content">
                          {msg.productName && (
                            <div className="message-product">📦 {msg.productName}</div>
                          )}
                          <p>{msg.message}</p>
                        </div>
                        <span className="message-time">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <form className="message-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="message-input"
                    aria-label="Message input"
                  />
                  <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="chat-empty">
                <p>Select a farmer to start chatting</p>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
