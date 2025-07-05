import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MonitorHome from './pages/monitorhome';
import Sidebar from './components/Sidebar';
import PieChart3D from './pages/PieChart3D';
import Advantis from './pages/Advantis';
import Fiber from './pages/Fiber';

function Navigation() {
  const location = useLocation();
}

function App() {
  return (
    <div className="App">
      <Navigation />
      <Sidebar />
      <div style={{ marginLeft: '250px', paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<MonitorHome />} />
          <Route path="/pie-chart" element={<PieChart3D />} />
          <Route path="/advantis" element={<Advantis />} /> 
          <Route path="/fiber" element={<Fiber />} />
         </Routes>
      </div>
    </div>
  );
}

export default App;