import React, { lazy } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RemoteBoundary from './RemoteBoundary';
import { useAuthSession } from '../auth/authStore';

const RemoteMiniCartBadge = lazy(() => import('cart/MiniCartBadge'));

export const Header: React.FC = () => {
  const location = useLocation();
  const { session, isAuthenticated, openModal, logout } = useAuthSession();

  const isProductsActive = location.pathname === '/' || location.pathname === '/products';
  const isCartActive = location.pathname === '/cart';
  const isOrdersActive = location.pathname === '/orders';

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
            <Link
              to="/orders"
              style={isOrdersActive ? activeNavLinkStyle : navLinkStyle}
            >
              Pesanan Saya
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

          <div style={dividerStyle} />

          {isAuthenticated && session?.user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={userBadgeStyle}>
                <span style={{ fontSize: '15px' }}>👤</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    {session.user.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                    Token Aktif
                  </div>
                </div>
              </div>
              <button onClick={logout} style={logoutButtonStyle}>
                Keluar
              </button>
            </div>
          ) : (
            <button onClick={openModal} style={loginButtonStyle}>
              🔑 Masuk
            </button>
          )}
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

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '24px',
  backgroundColor: '#e2e8f0',
};

const userBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 10px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
};

const loginButtonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  padding: '7px 14px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};

const logoutButtonStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};
