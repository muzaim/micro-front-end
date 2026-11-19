import React, { useState } from 'react';
import type { Product } from '@mfe/shared-types';
import { publishAddToCart } from '@mfe/shared-events';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    publishAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div style={cardStyle}>
      <img src={product.image} alt={product.name} style={imageStyle} />
      <div style={contentStyle}>
        <span style={categoryBadgeStyle}>{product.category || 'Product'}</span>
        <h3 style={titleStyle}>{product.name}</h3>
        <p style={descriptionStyle}>{product.description}</p>
        <div style={footerStyle}>
          <span style={priceStyle}>${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            style={isAdded ? buttonAddedStyle : buttonStyle}
          >
            {isAdded ? '✓ Added' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  backgroundColor: '#f1f5f9',
};

const contentStyle: React.CSSProperties = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
};

const categoryBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  fontWeight: 600,
  marginBottom: '6px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '17px',
  fontWeight: 600,
  color: '#0f172a',
  margin: '0 0 8px 0',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#475569',
  lineHeight: 1.5,
  flexGrow: 1,
  marginBottom: '16px',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: '12px',
  borderTop: '1px solid #f1f5f9',
};

const priceStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#0f172a',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const buttonAddedStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#16a34a',
};
