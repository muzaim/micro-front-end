import React from 'react';
import ProductList from './components/ProductList';

export const App: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        padding: '12px 24px',
        backgroundColor: '#e0f2fe',
        border: '1px solid #7dd3fc',
        borderRadius: '8px',
        color: '#0369a1',
        fontSize: '14px',
        fontWeight: 500
      }}>
        ℹ️ Standalone Dev Mode: You are viewing <strong>Catalog Remote App</strong> running independently on port 3001.
      </div>
      <ProductList />
    </div>
  );
};

export default App;
