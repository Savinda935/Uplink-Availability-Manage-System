import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  // Mock location for demonstration - replace with useLocation() in your app
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);

  const sidebarStyle = {
    width: '250px',
    backgroundColor: 'rgba(52, 58, 64, 0.85)', // Slightly more opaque for better readability
    padding: '20px',
    height: 'calc(100vh - 64px)',
    color: 'white',
    position: 'fixed',
    top: '15px',
    left: 0,
    overflowY: 'auto',
    backdropFilter: 'blur(12px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    zIndex: 1000
  };

  const headerStyle = {
    color: '#fff',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '15px'
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    fontWeight: '500',
    border: '1px solid transparent',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  };

  const getButtonStyle = (path) => {
    const isActive = location.pathname === path;
    const isHovered = hoveredLink === path;
    
    return {
      ...linkStyle,
      backgroundColor: isActive 
        ? 'rgba(0, 123, 255, 0.8)' 
        : isHovered 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'transparent',
      border: isActive 
        ? '1px solid rgba(0, 123, 255, 0.6)' 
        : '1px solid rgba(255, 255, 255, 0.1)',
      transform: isHovered && !isActive ? 'translateX(5px)' : 'translateX(0)',
      boxShadow: isActive 
        ? '0 4px 12px rgba(0, 123, 255, 0.3)' 
        : isHovered 
          ? '0 2px 8px rgba(255, 255, 255, 0.1)' 
          : 'none'
    };
  };

  const iconStyle = {
    marginRight: '12px',
    fontSize: '1.1rem',
    opacity: 0.9
  };

  const menuItems = [
    { path: '/', label: 'Uplink Availability', icon: '' },
    { path: '/advantis', label: 'WAN Firewall Availability ADVANTIS', icon: '' },
    { path: '/fiber', label: 'WAN Firewall Availability Fiber', icon: '' },
    
  ];

  const handleNavigation = (path) => {
    // Replace with your navigation logic
    navigate(path);
  };

  return (
    <div style={sidebarStyle}>
      <h3 style={headerStyle}>Navigation</h3>
      
      <nav>
        {menuItems.map((item) => (
          <div
            key={item.path}
            style={getButtonStyle(item.path)}
            onMouseEnter={() => setHoveredLink(item.path)}
            onMouseLeave={() => setHoveredLink(null)}
            onClick={() => handleNavigation(item.path)}
          >
            <span style={iconStyle}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* Optional: Add a footer section */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        opacity: 0.6,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '15px'
      }}>
        <p>v1.0.0</p>
      </div>
    </div>
  );
}

export default Sidebar;