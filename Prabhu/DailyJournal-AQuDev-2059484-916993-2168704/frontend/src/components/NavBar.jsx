import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Journal' },
  { to: '/charts', label: 'Analytics' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'App Info' },
];

const NavBar = () => {
  const location = useLocation();
  return (
    <nav className="nav-bar">
      {navItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={location.pathname === item.to ? 'active' : ''}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavBar;
