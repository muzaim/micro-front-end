import React, { useState } from 'react';
import type { Product } from '@mfe/shared-types';
import { MOCK_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products?: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products = MOCK_PRODUCTS }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Product Catalog</h2>
          <p style={subtitleStyle}>Micro Frontend Remote (Catalog App on Port 3001)</p>
        </div>
        <div style={filterContainerStyle}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as string)}
              style={selectedCategory === cat ? activeFilterButtonStyle : filterButtonStyle}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

const containerStyle: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '24px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#0f172a',
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  margin: '4px 0 0 0',
};

const filterContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const filterButtonStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  border: '1px solid #cbd5e1',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
  color: '#475569',
};

const activeFilterButtonStyle: React.CSSProperties = {
  ...filterButtonStyle,
  backgroundColor: '#0f172a',
  color: '#ffffff',
  borderColor: '#0f172a',
  fontWeight: 600,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '24px',
};
