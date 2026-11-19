import React from 'react';
import type { Order } from '@mfe/shared-types';
import { useOrders } from '../store/orderStore';

interface OrdersPageProps {
  onContinueShopping?: () => void;
  onRequestLogin?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onContinueShopping,
  onRequestLogin,
}) => {
  const { orders, session } = useOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'qris':
        return 'QRIS (Instant Pay)';
      case 'bank_transfer':
        return 'Virtual Account / Transfer Bank';
      case 'cod':
        return 'COD (Bayar di Tempat)';
      default:
        return method;
    }
  };

  // State: Not Logged In
  if (!session || !session.user) {
    return (
      <div style={containerStyle}>
        <div style={authCardStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
            Lihat Pesanan Saya
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '440px', lineHeight: 1.5 }}>
            Silakan login terlebih dahulu untuk melihat daftar riwayat transaksi belanja Anda.
          </p>
          <div style={credentialBoxStyle}>
            <p style={{ margin: 0, fontWeight: 600, color: '#334155', fontSize: '13px' }}>Akun Uji Coba (Password: <code>password123</code>):</p>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#2563eb', textAlign: 'left', lineHeight: 1.6 }}>
              <li><strong>Budi Santoso</strong>: budi@mfe.com (alias: user@mfe.com)</li>
              <li><strong>Siti Rahma</strong>: siti@mfe.com</li>
              <li><strong>Andi Pratama</strong>: andi@mfe.com</li>
            </ul>
          </div>
          <button
            onClick={() => {
              if (onRequestLogin) onRequestLogin();
              else {
                const event = new CustomEvent('auth:open-modal', { bubbles: true, composed: true });
                window.dispatchEvent(event);
              }
            }}
            style={primaryButtonStyle}
          >
            🔑 Login Akun
          </button>
        </div>
      </div>
    );
  }

  // State: Logged in, No Orders
  if (orders.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerSectionStyle}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
            Pesanan Saya
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
            User: <strong>{session.user.name}</strong> ({session.user.email})
          </p>
        </div>

        <div style={authCardStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
            Belum Ada Riwayat Pesanan
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
            Anda belum pernah melakukan checkout. Yuk jelajahi katalog dan belanja produk favorit Anda!
          </p>
          <button
            onClick={() => {
              if (onContinueShopping) onContinueShopping();
              else window.location.href = '/products';
            }}
            style={primaryButtonStyle}
          >
            🛍️ Mulai Belanja Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerSectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
              Pesanan Saya
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
              Menampilkan {orders.length} transaksi untuk <strong>{session.user.name}</strong> (Data persisten di LocalStorage)
            </p>
          </div>
          <button
            onClick={() => {
              if (onContinueShopping) onContinueShopping();
              else window.location.href = '/products';
            }}
            style={outlineButtonStyle}
          >
            + Belanja Lagi
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map((order) => (
          <div key={order.id} style={orderCardStyle}>
            {/* Top Bar: Order ID, Date, Status */}
            <div style={orderHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>📦</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                    {order.id}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>

              <div style={statusBadgeStyle}>
                ✅ Pembayaran Berhasil & Diproses
              </div>
            </div>

            {/* Items List */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                      {item.quantity} x {formatPrice(item.product.price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details Footer */}
            <div style={orderFooterStyle}>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                <div><strong>Alamat:</strong> {order.shippingAddress.fullName} ({order.shippingAddress.phone}), {order.shippingAddress.streetAddress}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</div>
                <div style={{ marginTop: '4px' }}><strong>Metode:</strong> {getPaymentLabel(order.paymentMethod)}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '13px', color: '#64748b', marginRight: '8px' }}>Total Belanja:</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

// Inline Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '32px 20px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const headerSectionStyle: React.CSSProperties = {
  marginBottom: '28px',
};

const orderCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
};

const orderHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
};

const statusBadgeStyle: React.CSSProperties = {
  backgroundColor: '#dcfce7',
  color: '#15803d',
  fontSize: '12px',
  fontWeight: 700,
  padding: '6px 12px',
  borderRadius: '9999px',
};

const orderFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e2e8f0',
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
};

const outlineButtonStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  color: '#2563eb',
  border: '1.5px solid #2563eb',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
};

const authCardStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 24px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  maxWidth: '520px',
  margin: '40px auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const credentialBoxStyle: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '24px',
  textAlign: 'left',
  width: '100%',
  boxSizing: 'border-box',
};
