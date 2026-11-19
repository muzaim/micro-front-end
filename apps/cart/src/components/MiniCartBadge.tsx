import React from 'react';
import { useCart } from '../store/cartStore';

interface MiniCartBadgeProps {
  onNavigateToCart?: () => void;
}

export const MiniCartBadge: React.FC<MiniCartBadgeProps> = ({ onNavigateToCart }) => {
  const { totalCount } = useCart();

  const handleClick = () => {
    if (onNavigateToCart) {
      onNavigateToCart();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/cart';
    }
  };

  return (
    <button
      onClick={handleClick}
      style={badgeButtonStyle}
      aria-label={`Cart with ${totalCount} items`}
    >
      <span style={{ fontSize: '18px' }}>🛒</span>
      <span style={textStyle}>Cart</span>
      <span style={countPillStyle}>
        {totalCount}
      </span>
    </button>
  );
};

export default MiniCartBadge;

const badgeButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.15s ease, background-color 0.2s',
};

const textStyle: React.CSSProperties = {
  display: 'inline-block',
};

const countPillStyle: React.CSSProperties = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 700,
  padding: '2px 7px',
  borderRadius: '10px',
  minWidth: '18px',
  textAlign: 'center',
};
