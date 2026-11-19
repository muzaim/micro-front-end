import React, { useState } from 'react';
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';

export const App: React.FC = () => {
  const [tab, setTab] = useState<'checkout' | 'orders'>('checkout');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto 20px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setTab('checkout')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: tab === 'checkout' ? '#2563eb' : '#e2e8f0',
            color: tab === 'checkout' ? '#ffffff' : '#334155',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Checkout Preview
        </button>
        <button
          onClick={() => setTab('orders')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: tab === 'orders' ? '#2563eb' : '#e2e8f0',
            color: tab === 'orders' ? '#ffffff' : '#334155',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Pesanan Saya Preview
        </button>
      </div>

      {tab === 'checkout' ? <CheckoutPage /> : <OrdersPage />}
    </div>
  );
};

export default App;
