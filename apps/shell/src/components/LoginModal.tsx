import React, { useState } from 'react';
import { useAuthSession, DUMMY_USERS } from '../auth/authStore';

export const LoginModal: React.FC = () => {
  const { isModalOpen, closeModal, login } = useAuthSession();
  const [email, setEmail] = useState(DUMMY_USERS[0].email);
  const [password, setPassword] = useState(DUMMY_USERS[0].password);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);
      if (!result.success) {
        setError(result.error || 'Login gagal.');
      }
    }, 400);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
            🔐 Login Akun MFE
          </h2>
          <button
            onClick={closeModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
          Login ini mensimulasikan otentikasi di Host Shell. Token sesi akan dibagikan ke remote apps (Catalog, Cart, Orders) via LocalStorage & Browser Events.
        </p>

        {/* 1-Click Quick Select Profile */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            ⚡ Pilih Cepat Akun Demo (1-Click Autofill):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {DUMMY_USERS.map((acc) => {
              const isSelected = email === acc.email || email === acc.aliasEmail;
              return (
                <button
                  key={acc.user.id}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.password);
                    setError('');
                  }}
                  style={{
                    padding: '8px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '12px', color: '#0f172a' }}>
                    {acc.user.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {acc.email}
                  </span>
                  <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 500 }}>
                    ID: {acc.user.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={hintBoxStyle}>
          <div style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '12px', marginBottom: '6px' }}>
            💡 Kredensial 3 Akun Dummy:
          </div>
          <div style={{ fontSize: '11px', color: '#1e40af', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>1. <strong>Budi Santoso</strong>: budi@mfe.com (alias: user@mfe.com)</div>
            <div>2. <strong>Siti Rahma</strong>: siti@mfe.com</div>
            <div>3. <strong>Andi Pratama</strong>: andi@mfe.com</div>
            <div style={{ marginTop: '2px', color: '#3b82f6' }}>
              Password semua akun: <code>password123</code>
            </div>
          </div>
        </div>

        {error && (
          <div style={errorStyle}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...buttonStyle,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(2px)',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  width: '100%',
  maxWidth: '420px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const hintBoxStyle: React.CSSProperties = {
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  padding: '10px 12px',
  marginBottom: '16px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  marginTop: '8px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '11px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#b91c1c',
  fontSize: '13px',
  borderRadius: '8px',
  padding: '10px 12px',
  marginBottom: '14px',
};
