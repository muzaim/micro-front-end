import React, { lazy } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RemoteBoundary from './RemoteBoundary';

const RemoteMiniCartBadge = lazy(() => import('cart/MiniCartBadge'));

export const Header: React.FC = () => {
  const location = useLocation();

  const isProductsActive = location.pathname === '/' || location.pathname === '/products';
  const isCartActive = location.pathname === '/cart';

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={leftSectionStyle}>
          <Link to="/" style={logoLinkStyle}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <div>
              <span style={logoTextStyle}>MFE Commerce</span>
              <span style={hostBadgeStyle}>Host Shell (Port 3000)</span>
            </div>
          </Link>

          <nav style={navStyle}>
            <Link
              to="/products"
              style={isProductsActive ? activeNavLinkStyle : navLinkStyle}
            >
              Catalog
            </Link>
            <Link
              to="/cart"
              style={isCartActive ? activeNavLinkStyle : navLinkStyle}
            >
              Cart
            </Link>
          </nav>
        </div>

        <div style={rightSectionStyle}>
          <RemoteBoundary
            remoteName="Cart Badge"
            fallback={
              <Link to="/cart" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>
                🛒 Cart (offline)
              </Link>
            }
          >
            <RemoteMiniCartBadge />
          </RemoteBoundary>
        </div>
      </div>
    </header>
  );
};

export default Header;

const headerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  position: 'sticky',
  top: 0,
  zIndex: 50,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '12px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const leftSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
};

const logoLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 800,
  color: '#0f172a',
  letterSpacing: '-0.02em',
  display: 'block',
};

const hostBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  backgroundColor: '#ede9fe',
  color: '#6d28d9',
  padding: '2px 6px',
  borderRadius: '4px',
  display: 'inline-block',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
};

const navLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
  color: '#475569',
  padding: '6px 12px',
  borderRadius: '6px',
  transition: 'color 0.15s, background-color 0.15s',
};

const activeNavLinkStyle: React.CSSProperties = {
  ...navLinkStyle,
  color: '#2563eb',
  backgroundColor: '#eff6ff',
  fontWeight: 600,
};

const rightSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};
