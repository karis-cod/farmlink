import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavLinks } from './NavLinks';
import type { NavItem } from './NavLinks';
import { Sidebar } from './Sidebar';
import './Navigation.css';

const NAV_ITEMS: NavItem[] = [
  { path: '/search', label: 'Search', icon: '🔍' },
  { path: '/farmers', label: 'Farmers', icon: '👨‍🌾' },
  { path: '/chat', label: 'Chat', icon: '💬' },
  { path: '/negotiations', label: 'Negotiate', icon: '💰' },
];

export function Navigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🌱 FarmLink
        </Link>

        <div className="navbar-links desktop-only">
          <NavLinks items={NAV_ITEMS} />
        </div>

        <button
          type="button"
          className="navbar-burger mobile-only"
          aria-controls="mobile-navigation"
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsSidebarOpen((current) => !current)}
        >
          <span className="burger-dot" />
          <span className="burger-dot" />
          <span className="burger-dot" />
        </button>
      </div>

      <Sidebar open={isSidebarOpen} items={NAV_ITEMS} onClose={() => setIsSidebarOpen(false)} />
    </nav>
  );
}
