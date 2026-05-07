import { useEffect, useRef } from 'react';
import { NavLinks } from './NavLinks';
import type { NavItem } from './NavLinks';

interface SidebarProps {
  open: boolean;
  items: NavItem[];
  onClose: () => void;
}

export function Sidebar({ open, items, onClose }: SidebarProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'sidebar-open' : ''}`} onClick={onClose} />
      <aside
        id="mobile-navigation"
        className={`sidebar-drawer ${open ? 'sidebar-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">🌱</span>
            <span>FarmLink</span>
          </div>
          <button
            type="button"
            className="sidebar-close"
            aria-label="Close navigation menu"
            onClick={onClose}
            ref={closeButtonRef}
          >
            ✕
          </button>
        </div>

        <div className="sidebar-links">
          <NavLinks items={items} variant="sidebar" onLinkClick={onClose} />
        </div>
      </aside>
    </>
  );
}
