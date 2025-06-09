import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#343a40',
    padding: '20px',
    height: 'calc(100vh - 64px)', // Adjusted for header height
    color: 'white',
    position: 'fixed',
    top: '64px', // Below the header
    left: 0,
    overflowY: 'auto'
  };

  const linkStyle = {
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    padding: '10px 15px',
    marginBottom: '10px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#007bff'
  };

  return (
    <div style={sidebarStyle}>
      <h3 style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>Navigation</h3>
      <Link to="/" style={location.pathname === '/' ? activeLinkStyle : linkStyle}>
        Dashboard
      </Link>
      <Link to="/all-sectors" style={location.pathname === '/all-sectors' ? activeLinkStyle : linkStyle}>
        All Sectors Data
      </Link>
      {/* Add more links here if needed */}
    </div>
  );
}

export default Sidebar; 