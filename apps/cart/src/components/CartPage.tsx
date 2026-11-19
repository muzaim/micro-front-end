import React from 'react';
import { useCart } from '../store/cartStore';

interface CartPageProps {
  onContinueShopping?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onContinueShopping }) => {
  const { items, totalCount, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  const handleBackToShop = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  if (items.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyCardStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <button onClick={handleBackToShop} style={primaryBtnStyle}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const shipping = totalPrice > 100 ? 0 : 15.0;
  const grandTotal = totalPrice + shipping;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Shopping Cart</h1>
          <p style={subtitleStyle}>Micro Frontend Remote (Cart App on Port 3002)</p>
        </div>
        <button onClick={clearCart} style={secondaryBtnStyle}>
          Clear All Items
        </button>
      </div>

      <div style={contentGridStyle}>
        {/* Items List */}
        <div style={itemsListStyle}>
          {items.map((item) => (
            <div key={item.product.id} style={itemRowStyle}>
              <img src={item.product.image} alt={item.product.name} style={thumbnailStyle} />
              <div style={itemDetailsStyle}>
                <h3 style={itemNameStyle}>{item.product.name}</h3>
                <span style={itemPriceStyle}>${item.product.price.toFixed(2)} each</span>
              </div>
              <div style={quantityControlsStyle}>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  style={qtyBtnStyle}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span style={qtyTextStyle}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  style={qtyBtnStyle}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div style={lineTotalStyle}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                style={removeBtnStyle}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={summaryCardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#0f172a' }}>
            Order Summary
          </h2>
          <div style={summaryRowStyle}>
            <span style={{ color: '#64748b' }}>Items ({totalCount})</span>
            <span style={{ fontWeight: 600 }}>${totalPrice.toFixed(2)}</span>
          </div>
          <div style={summaryRowStyle}>
            <span style={{ color: '#64748b' }}>Estimated Shipping</span>
            <span style={{ fontWeight: 600 }}>
              {shipping === 0 ? <span style={{ color: '#16a34a' }}>FREE</span> : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />
          <div style={{ ...summaryRowStyle, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => alert(`Demo checkout for $${grandTotal.toFixed(2)}! (MFE Order Flow Complete)`)}
            style={{ ...primaryBtnStyle, width: '100%', marginTop: '20px' }}
          >
            Proceed to Checkout
          </button>
          <button
            onClick={handleBackToShop}
            style={{ ...secondaryBtnStyle, width: '100%', marginTop: '8px', textAlign: 'center' }}
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

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
};

const titleStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 700,
  color: '#0f172a',
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  margin: '4px 0 0 0',
};

const contentGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 340px',
  gap: '32px',
  alignItems: 'start',
};

const itemsListStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
};

const itemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: '1px solid #f1f5f9',
  gap: '16px',
};

const thumbnailStyle: React.CSSProperties = {
  width: '72px',
  height: '72px',
  objectFit: 'cover',
  borderRadius: '8px',
  backgroundColor: '#f1f5f9',
};

const itemDetailsStyle: React.CSSProperties = {
  flexGrow: 1,
};

const itemNameStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#0f172a',
  margin: '0 0 4px 0',
};

const itemPriceStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
};

const quantityControlsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  overflow: 'hidden',
};

const qtyBtnStyle: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: 'none',
  padding: '6px 10px',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '14px',
  color: '#334155',
};

const qtyTextStyle: React.CSSProperties = {
  padding: '0 12px',
  fontWeight: 600,
  fontSize: '14px',
  color: '#0f172a',
};

const lineTotalStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#0f172a',
  minWidth: '70px',
  textAlign: 'right',
};

const removeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  fontSize: '16px',
  padding: '4px',
};

const summaryCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
};

const summaryRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  marginBottom: '12px',
};

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const secondaryBtnStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#64748b',
  border: '1px solid #cbd5e1',
  padding: '8px 14px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
};

const emptyCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: '64px 24px',
  textAlign: 'center',
  maxWidth: '480px',
  margin: '40px auto',
};
