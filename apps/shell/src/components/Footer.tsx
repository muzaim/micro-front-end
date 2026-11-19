import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Micro Frontend Architecture Demo</span>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Built with React, Vite Module Federation, and pnpm workspaces.
          </p>
        </div>
        <div style={mfeBadgesContainer}>
          <span style={badgeStyle}>Host: Shell (3000)</span>
          <span style={badgeStyle}>Remote: Catalog (3001)</span>
          <span style={badgeStyle}>Remote: Cart (3002)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const footerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderTop: '1px solid #e2e8f0',
  marginTop: 'auto',
  padding: '24px 0',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
};

const mfeBadgesContainer: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#475569',
  padding: '4px 8px',
};
