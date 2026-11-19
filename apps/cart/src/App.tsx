import React from 'react';
import CartPage from './components/CartPage';
import MiniCartBadge from './components/MiniCartBadge';

export const App: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        padding: '12px 24px',
        backgroundColor: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: '8px',
        color: '#92400e',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>ℹ️ Standalone Dev Mode: You are viewing <strong>Cart Remote App</strong> running independently on port 3002.</span>
        <MiniCartBadge />
      </div>
      <CartPage />
    </div>
  );
};

export default App;
