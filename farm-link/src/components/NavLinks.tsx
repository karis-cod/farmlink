import { NavLink } from 'react-router-dom';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface NavLinksProps {
  items: NavItem[];
  onLinkClick?: () => void;
  variant?: 'desktop' | 'sidebar';
}

export function NavLinks({ items, onLinkClick, variant = 'desktop' }: NavLinksProps) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          onClick={onLinkClick}
          className={({ isActive }) => [
            'nav-link',
            variant === 'sidebar' ? 'sidebar-link' : '',
            isActive ? 'nav-link-active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="nav-link-icon">{item.icon}</span>
          <span className="nav-link-label">{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}
