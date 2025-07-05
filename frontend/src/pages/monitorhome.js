import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import { getSectors, addOrUpdateSector, SECTOR_LIST } from '../API';
import fitlogo from '../images/fitlogo.png';
import AmchartsPie3D from '../components/AmchartsPie3D';
import noc from '../images/noc.jpg';
import Swal from 'sweetalert2';

function MonitorHome() {
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [average, setAverage] = useState(0);
  const [highest, setHighest] = useState(0);
  const [lowest, setLowest] = useState(0);
  const [sectorInputs, setSectorInputs] = useState({});
  const [uptime100Count, setUptime100Count] = useState(0);
  const [uptimeLessThan100Count, setUptimeLessThan100Count] = useState(0);
  const [amChartInstance, setAmChartInstance] = useState(null);

  // Enhanced Styles with modern design
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,rgb(248, 248, 248) 0%,rgb(245, 244, 247) 100%)',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const mainContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    overflow: 'hidden'
  };

  const headerStyle = {
    backgroundImage: `url(${noc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '40px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  };
  

  const headerTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '10px',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const logoStyle = {
    width: '120px',
    height: 'auto',
    margin: '20px auto',
    display: 'block',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    padding: '10px'
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    padding: '40px'
  };

  const sectionStyle = {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
  };

  const selectStyle = {
    width: '100%',
    minHeight: '140px',
    padding: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    fontFamily: 'inherit'
  };

  const inputRowStyle = {
    margin: '16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.6)',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.4)'
  };

  const inputLabelStyle = {
    minWidth: '100px',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px'
  };

  const inputFieldStyle = {
    width: '100px',
    padding: '10px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  };

  const modernButtonStyle = {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginTop: '20px',
    position: 'relative',
    overflow: 'hidden'
  };

  const analysisContainerStyle = {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
    padding: '25px',
    borderRadius: '16px',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    backdropFilter: 'blur(10px)'
  };

  const statsCardStyle = {
    background: 'rgba(255,255,255,0.9)',
    padding: '20px',
    borderRadius: '12px',
    margin: '10px 0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease'
  };

  const placeholderStyle = {
    textAlign: 'center',
    padding: '60px 40px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
    borderRadius: '20px',
    border: '2px dashed rgba(102, 126, 234, 0.3)',
    color: '#667eea',
    fontSize: '18px',
    fontWeight: '500'
  };

  const smallTextStyle = {
    color: '#718096',
    fontSize: '12px',
    marginTop: '8px',
    fontStyle: 'italic'
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  useEffect(() => {
    const currentValues = Object.entries(sectorInputs)
      .filter(([name, value]) => selectedSectors.includes(name) && value !== '')
      .map(([name, value]) => Number(value) || 0);

    const avg = currentValues.length ? (currentValues.reduce((a, b) => a + b, 0) / currentValues.length).toFixed(2) : 0;
    const high = currentValues.length ? Math.max(...currentValues).toFixed(2) : 0;
    const low = currentValues.length ? Math.min(...currentValues).toFixed(2) : 0;

    setAverage(avg);
    setHighest(high);
    setLowest(low);

    const count100 = selectedSectors.filter(s => Number(sectorInputs[s]) === 100).length;
    const countLessThan100 = selectedSectors.length - count100;

    setUptime100Count(count100);
    setUptimeLessThan100Count(countLessThan100);
  }, [selectedSectors, sectorInputs]);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const data = await getSectors();
      setSectors(data);
      
      const initialInputs = {};
      const initialSelected = [];
      data.forEach(sector => {
        if (SECTOR_LIST.includes(sector.name)) {
          initialInputs[sector.name] = sector.availability;
          initialSelected.push(sector.name);
        }
      });
      setSectorInputs(initialInputs);
      setSelectedSectors(initialSelected);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error fetching sectors',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSectorChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options.filter(o => o.selected).map(o => o.value);
    setSelectedSectors(selected);

    setSectorInputs(prev => {
      const newInputs = {};
      selected.forEach(s => {
        newInputs[s] = prev[s] !== undefined ? prev[s] : '';
      });
      return newInputs;
    });
  };

  const handlePercentageChange = (sectorName, value) => {
    if (/^\d{0,3}(\.\d{0,2})?$/.test(value) && value <= 100) {
      setSectorInputs(prev => ({ ...prev, [sectorName]: value }));
    }
  };

  const handleSaveAllSelectedSectors = async () => {
    if (selectedSectors.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Sectors Selected',
        text: 'Please select at least one sector to save.'
      });
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const sectorName of selectedSectors) {
        const availability = Number(sectorInputs[sectorName]);

        if (isNaN(availability) || availability < 0 || availability > 100) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Availability',
            text: `Invalid availability for ${sectorName}. Please enter a value between 0-100.`
          });
          errorCount++;
          continue;
        }

        try {
          await addOrUpdateSector(sectorName, availability);
          successCount++;
        } catch (error) {
          console.error(`Error saving ${sectorName}:`, error);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: `Successfully saved ${successCount} sectors.`
        });
      }
      if (errorCount > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Partial Save',
          text: `Failed to save ${errorCount} sectors.`
        });
      }

      fetchSectors();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error saving sectors',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (selectedSectors.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Sectors Selected',
        text: 'Please select sectors to generate a report.'
      });
      return;
    }

    let csvContent = 'Uplink Availability Report\n\n';
    csvContent += 'Overall Analysis\n';
    csvContent += `Average Availability,%${average}\n`;
    csvContent += `Highest Availability,%${highest}\n`;
    csvContent += `Lowest Availability,%${lowest}\n`;
    csvContent += `Total Selected Sectors,${selectedSectors.length}\n`;
    csvContent += `Uptime = 100% Sectors,${uptime100Count}\n`;
    csvContent += `Uptime < 100% Sectors,${uptimeLessThan100Count}\n\n`;
    csvContent += 'Individual Sector Data\n';
    csvContent += 'Sector Name,Availability Percentage\n';
    selectedSectors.forEach(sectorName => {
      const availability = sectorInputs[sectorName] !== undefined ? sectorInputs[sectorName] : '';
      csvContent += `${sectorName},${availability}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'uplink_availability_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Report Generated!',
      text: 'Uplink availability report has been generated successfully.'
    });
  };

  const handleChartExport = () => {
    if (amChartInstance) {
      amChartInstance.exporting.export("png", {
        fileName: "uplink_availability_chart"
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Chart Instance Not Ready',
        text: 'Chart instance not ready for export.'
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>Uplink Availability Dashboard</h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            margin: 0,
            fontWeight: '300'
          }}>
            Monitor and analyze sector performance in real-time
          </p>
          <img src={fitlogo} alt="Fit Logo" style={logoStyle} />
          
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(40px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            filter: 'blur(30px)'
          }} />
        </div>
        
        <div style={gridContainerStyle}>
          {/* Left Column */}
          <div style={sectionStyle}>
            <h3 style={{ ...sectionTitleStyle, display: 'flex', alignItems: 'center' }} className="section-title-icon">
              Sector Management
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="sector-select" style={{
                display: 'block',
                marginBottom: '12px',
                fontWeight: '600',
                color: '#4a5568',
                fontSize: '16px'
              }}>
                Select Sectors for View/Edit:
              </label>
              <select
                id="sector-select"
                multiple
                value={selectedSectors}
                onChange={handleSectorChange}
                style={{
                  ...selectStyle,
                  ':focus': {
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }
                }}
              >
                {SECTOR_LIST.map(sector => (
                  <option key={sector} value={sector} style={{
                    padding: '8px',
                    fontSize: '14px'
                  }}>
                    {sector}
                  </option>
                ))}
              </select>
              <small style={smallTextStyle}>
                💡 Hold Ctrl (or Cmd on Mac) to select multiple sectors
              </small>
            </div>

            {selectedSectors.length > 0 && (
              <div>
                <h4 style={{
                  ...sectionTitleStyle,
                  fontSize: '1.2rem',
                  marginBottom: '20px'
                }}>
                  📝 Enter/Edit Availability Percentages:
                </h4>
                
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.4)'
                }}>
                  {selectedSectors.map(sectorName => (
                    <div key={sectorName} style={{
                      ...inputRowStyle,
                      ':hover': {
                        background: 'rgba(255,255,255,0.8)',
                        transform: 'translateY(-1px)'
                      }
                    }}>
                      <label style={inputLabelStyle}>{sectorName}:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={sectorInputs[sectorName] !== undefined ? sectorInputs[sectorName] : ''}
                        onChange={e => handlePercentageChange(sectorName, e.target.value)}
                        style={{
                          ...inputFieldStyle,
                          ':focus': {
                            borderColor: '#667eea',
                            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                          }
                        }}
                        placeholder="0.00"
                      />
                      <span style={{ color: '#667eea', fontWeight: '600' }}>%</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={handleSaveAllSelectedSectors}
                  disabled={loading || selectedSectors.length === 0}
                  style={{
                    ...modernButtonStyle,
                    width: '100%',
                    opacity: loading || selectedSectors.length === 0 ? 0.6 : 1,
                    cursor: loading || selectedSectors.length === 0 ? 'not-allowed' : 'pointer',
                    ':hover': !loading && selectedSectors.length > 0 ? {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)'
                    } : {}
                  }}
                >
                  {loading ? '💾 Saving...' : '💾 Save All Selected Sectors'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={sectionStyle}>
            <h3 style={{ ...sectionTitleStyle, display: 'flex', alignItems: 'center' }} className="section-title-icon">
             Analytics & Visualization 
            </h3>
            
            {selectedSectors.length > 0 ? (
              <div>
                <div style={{ marginTop: '60px' }}>
                  <AmchartsPie3D
                    uptime100Count={uptime100Count}
                    uptimeLessThan100Count={uptimeLessThan100Count}
                    setChartInstance={setAmChartInstance}
                  />
                </div>

                {selectedSectors.length > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '30px',
                    gap: '20px'
                  }}>
                    <div style={{
                      ...statsCardStyle,
                      flex: 1,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <div style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
                        🟢 Uptime = 100%
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#047857', marginTop: '8px' }}>
                        {(selectedSectors.length > 0 ? (uptime100Count / selectedSectors.length * 100).toFixed(1) : 0)}%
                      </div>
                    </div>
                    
                    <div style={{
                      ...statsCardStyle,
                      flex: 1,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>
                        🔴 DownTime
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#b91c1c', marginTop: '8px' }}>
                        {(selectedSectors.length > 0 ? (uptimeLessThan100Count / selectedSectors.length * 100).toFixed(1) : 0)}%
                      </div>
                    </div>
                  </div>
                )}

                <div style={analysisContainerStyle}>
                  <h4 style={{ ...sectionTitleStyle, fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center' }} className="section-title-icon">
                    Detailed Analysis
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '20px'
                  }}>
                    <div style={statsCardStyle}>
                      <strong style={{ color: '#4a5568' }}>📈 Average:</strong>
                      <span style={{ color: '#667eea', fontWeight: '600', marginLeft: '8px' }}>
                        {average}%
                      </span>
                    </div>
                    <div style={statsCardStyle}>
                      <strong style={{ color: '#4a5568' }}>🎯 Highest:</strong>
                      <span style={{ color: '#10b981', fontWeight: '600', marginLeft: '8px' }}>
                        {highest}%
                      </span>
                    </div>
                    <div style={statsCardStyle}>
                      <strong style={{ color: '#4a5568' }}>📉 Lowest:</strong>
                      <span style={{ color: '#f56565', fontWeight: '600', marginLeft: '8px' }}>
                        {lowest}%
                      </span>
                    </div>
                    <div style={statsCardStyle}>
                      <strong style={{ color: '#4a5568' }}>📍 Total Sectors:</strong>
                      <span style={{ color: '#667eea', fontWeight: '600', marginLeft: '8px' }}>
                        17
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255,255,255,0.7)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.4)'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ color: '#10b981' }}>✅ Perfect Uptime (100%):</strong>
                      <span style={{ marginLeft: '8px', color: '#047857', fontWeight: '600' }}>
                        {uptime100Count} sectors ({(selectedSectors.length > 0 ? (uptime100Count / selectedSectors.length * 100).toFixed(0) : 0)}%)
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#f56565' }}>⚠️ Needs Attention (&lt;100%):</strong>
                      <span style={{ marginLeft: '8px', color: '#dc2626', fontWeight: '600' }}>
                        {uptimeLessThan100Count} sectors ({(selectedSectors.length > 0 ? (uptimeLessThan100Count / selectedSectors.length * 100).toFixed(0) : 0)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={placeholderStyle}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
                <p style={{ margin: '0', fontSize: '16px' }}>
                  Select sectors from the left panel to view their interactive chart and detailed analysis
                </p>
              </div>
            )}
            
            {selectedSectors.length > 0 && (
              <button
                onClick={handleGenerateReport}
                style={{
                  ...modernButtonStyle,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                  width: '100%',
                  fontSize: '16px',
                  marginTop: '20px',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.6)'
                  }
                }}
              >
                📋 Generate Detailed Report (CSV)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }
        
        button:hover {
          transform: translateY(-2px);
        }
        
        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default MonitorHome;