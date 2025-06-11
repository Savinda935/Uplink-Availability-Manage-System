import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MonitorHome from './pages/monitorhome';
import AllSectorsTable from './pages/AllSectorsTable';
import Sidebar from './components/Sidebar';
import PieChart3D from './pages/PieChart3D';

function Navigation() {
  const location = useLocation();
  
  const navStyle = {
    backgroundColor: '#343a40',
    padding: '16px 24px',
    marginBottom: 24,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1000
  };
  
  const linkContainerStyle = {
    marginLeft: 'auto'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    marginRight: 16,
    borderRadius: 4,
    fontSize: 16,
    transition: 'background-color 0.3s ease'
  };
  
  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#007bff'
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', width: '100%' }}>
        <h1 style={{ color: 'white', margin: 0, marginRight: 32 }}>Uplink Monitor</h1>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <Navigation />
      <Sidebar />
      <div style={{ marginLeft: '250px', paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<MonitorHome />} />
          <Route path="/all-sectors" element={<AllSectorsTable />} />
          <Route path="/pie-chart" element={<PieChart3D />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;