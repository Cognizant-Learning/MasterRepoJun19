import React from 'react';
import { Link } from 'react-router-dom';

// Main layout with navigation, theming, and accessibility support
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <nav
        style={{
          display: 'flex',
          gap: 0,
          padding: 0,
          background: '#f5f5f5',
          width: '100%', // Changed from 100vw to 100%
          minWidth: 0, // Allow shrinking
          margin: 0,
          borderBottom: '1.5px solid #e0e0e0',
          boxShadow: '0 2px 8px #ececec',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          maxWidth: 600, // Optional: limit max width for aesthetics
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {[['/', 'Home'], ['/journal', 'Journal'], ['/auth', 'Login/Register']].map(([to, label], idx, arr) => (
          <Link
            key={to}
            to={to}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '16px 0',
              color: '#1976d2',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: 17,
              letterSpacing: 0.5,
              borderRight: idx < arr.length - 1 ? '1px solid #e0e0e0' : 'none',
              background: 'transparent',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e3f2fd')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
          >
            {label}
          </Link>
        ))}
      </nav>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
};

export default Layout;
