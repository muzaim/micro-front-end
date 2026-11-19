import React, { useState, useEffect } from 'react';
import type { Order, CartItem, PaymentMethod, ShippingAddress, AuthSession } from '@mfe/shared-types';
import { orderStore, useOrders } from '../store/orderStore';

interface CheckoutPageProps {
  onOrderSuccess?: (order: Order) => void;
  onRequestLogin?: () => void;
  onBackToCart?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onRequestLogin,
  onBackToCart,
}) => {
  const { session } = useOrders();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => orderStore.getCartItems());
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [phone, setPhone] = useState('081234567890');
  const [streetAddress, setStreetAddress] = useState('Jl. Jendral Sudirman No. 45');
  const [city, setCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('12190');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCartItems(orderStore.getCartItems());
    if (session?.user?.name && !fullName) {
      setFullName(session.user.name);
    }
  }, [session]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!session || !session.user) {
      setErrorMessage('Anda harus login terlebih dahulu.');
      if (onRequestLogin) onRequestLogin();
      return;
    }

    if (!fullName || !phone || !streetAddress || !city || !postalCode) {
      setErrorMessage('Mohon lengkapi semua kolom alamat pengiriman.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Keranjang belanja kosong.');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: ShippingAddress = {
      fullName,
      phone,
      streetAddress,
      city,
      postalCode,
    };

    setTimeout(() => {
      const result = orderStore.createOrder(shippingAddress, paymentMethod);
      setIsSubmitting(false);

      if (result.success && result.order) {
        if (onOrderSuccess) {
          onOrderSuccess(result.order);
        } else if (typeof window !== 'undefined') {
          window.location.href = '/orders';
        }
      } else {
        setErrorMessage(result.error || 'Gagal memproses pesanan.');
      }
    }, 600);
  };

  // State: Not Logged In
  if (!session || !session.user) {
    return (
      <div style={containerStyle}>
        <div style={authCardStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
            Autentikasi Diperlukan
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '440px', lineHeight: 1.5 }}>
            Untuk melanjutkan ke halaman checkout, Anda harus login terlebih dahulu dengan akun dummy yang telah disepakati.
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
            🔑 Buka Modal Login
          </button>
        </div>
      </div>
    );
  }

  // State: Empty Cart
  if (cartItems.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={authCardStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
            Keranjang Belanja Kosong
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
            Tidak ada produk untuk di-checkout. Silakan pilih produk di katalog terlebih dahulu.
          </p>
          <button
            onClick={() => {
              if (onBackToCart) onBackToCart();
              else window.location.href = '/products';
            }}
            style={primaryButtonStyle}
          >
            ← Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Token Verification Banner (Demonstrating Cross-MFE Auth Token Consumption) */}
      <div style={tokenBannerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#166534' }}>
              Cross-MFE Token Aktif: Terverifikasi di Remote Orders (Port 3003)
            </div>
            <div style={{ fontSize: '12px', color: '#15803d' }}>
              User: <strong>{session.user.name}</strong> ({session.user.email}) | User ID: <code>{session.user.id}</code> | Token: <code>{session.token.slice(0, 24)}...</code>
            </div>
          </div>
        </div>
      </div>

      <div style={headerSectionStyle}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
          Checkout Pesanan
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
          Simulasi pengisian alamat pengiriman dan pembayaran terintegrasi multi-MFE.
        </p>
      </div>

      {errorMessage && (
        <div style={errorBannerStyle}>
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={gridLayoutStyle}>
        {/* Left Column: Form Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Shipping Address Section */}
          <div style={cardStyle}>
            <h2 style={cardHeadingStyle}>📍 Alamat Pengiriman</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nama Penerima</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Alamat Lengkap</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Kode Pos</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div style={cardStyle}>
            <h2 style={cardHeadingStyle}>💳 Metode Pembayaran (Simulasi)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={paymentOptionStyle(paymentMethod === 'qris')}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'qris'}
                  onChange={() => setPaymentMethod('qris')}
                />
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>📱 QRIS (Instant Pay)</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Gopay, OVO, Dana, LinkAja, BCA Mobile</div>
                </div>
              </label>

              <label style={paymentOptionStyle(paymentMethod === 'bank_transfer')}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                />
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>🏦 Virtual Account / Transfer Bank</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>BCA, Mandiri, BNI, BRI</div>
                </div>
              </label>

              <label style={paymentOptionStyle(paymentMethod === 'cod')}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>📦 COD (Bayar di Tempat)</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Bayar tunai saat kurir tiba di tujuan</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div style={{ ...cardStyle, position: 'sticky', top: '24px' }}>
            <h2 style={cardHeadingStyle}>🛍️ Ringkasan Pesanan</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {cartItems.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <div style={{ color: '#334155' }}>
                    {item.product.name} <span style={{ color: '#94a3b8' }}>x{item.quantity}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
              <span>Subtotal Produk</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#64748b' }}>
              <span>Biaya Pengiriman</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>GRATIS (MFE Promo)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              <span>Total Tagihan</span>
              <span style={{ color: '#2563eb' }}>{formatPrice(totalAmount)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...primaryButtonStyle,
                width: '100%',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? '⏳ Memproses Pembayaran...' : '🚀 Bayar & Buat Pesanan'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onBackToCart) onBackToCart();
                else window.location.href = '/cart';
              }}
              style={secondaryButtonStyle}
            >
              ← Kembali ke Keranjang
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

// Inline Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '32px 20px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const headerSectionStyle: React.CSSProperties = {
  marginBottom: '28px',
};

const gridLayoutStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 380px',
  gap: '32px',
  alignItems: 'start',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0',
};

const cardHeadingStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  margin: '0 0 20px 0',
  color: '#0f172a',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#475569',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const tokenBannerStyle: React.CSSProperties = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '10px',
  padding: '12px 16px',
  marginBottom: '24px',
};

const errorBannerStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '20px',
  fontSize: '14px',
};

const paymentOptionStyle = (selected: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  padding: '14px',
  borderRadius: '8px',
  border: `1.5px solid ${selected ? '#2563eb' : '#e2e8f0'}`,
  backgroundColor: selected ? '#eff6ff' : '#ffffff',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
});

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

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#64748b',
  border: 'none',
  width: '100%',
  padding: '10px 16px',
  marginTop: '12px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'center',
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
