import React from 'react';

const headerStyle = {
  position: 'sticky',
  top: 0,
  width: '100%',
  background: '#222',
  color: '#fff',
  padding: '1rem 0',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  letterSpacing: '2px',
  zIndex: 1000,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
};

export default function Header() {
  return (
    <header style={headerStyle}>
      Digitals
    </header>
  );
}
