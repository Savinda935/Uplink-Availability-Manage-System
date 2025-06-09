import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { getSectors, addOrUpdateSector, SECTOR_LIST } from '../API';
import fitlogo from '../images/fitlogo.png';

function MonitorHome() {
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [average, setAverage] = useState(0);
  const [highest, setHighest] = useState(0);
  const [lowest, setLowest] = useState(0);

  // Refactor: Use a single state for selected sectors and their entered percentages
  const [sectorInputs, setSectorInputs] = useState({});
  const [uptime100Count, setUptime100Count] = useState(0);
  const [uptimeLessThan100Count, setUptimeLessThan100Count] = useState(0);

  // Styles
  const containerStyle = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 24,
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f7f6',
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  const headerStyle = {
    textAlign: 'center',
    color: '#333',
    marginBottom: 20
  };

  const logoStyle = {
    display: 'block',
    margin: '0 auto 20px auto',
    maxWidth: '150px',
    height: 'auto'
  };

  const messageStyle = (isError) => ({
    padding: 10,
    marginBottom: 16,
    backgroundColor: isError ? '#ffebee' : '#e8f5e8',
    color: isError ? '#c62828' : '#2e7d32',
    borderRadius: 4,
    border: `1px solid ${isError ? '#c62828' : '#2e7d32'}`
  });

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 32
  };

  const sectionTitleStyle = {
    color: '#555',
    marginBottom: 15,
    borderBottom: '1px solid #eee',
    paddingBottom: 10
  };

  const selectStyle = {
    width: '100%',
    minHeight: 120,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 14,
    marginBottom: 10
  };

  const smallTextStyle = {
    color: '#666',
    fontSize: 12
  };

  const inputRowStyle = {
    margin: '12px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  };

  const inputLabelStyle = {
    minWidth: 70,
    fontWeight: 'bold',
    color: '#444'
  };

  const inputFieldStyle = {
    width: 80,
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 14
  };

  const saveButtonStyle = {
    marginTop: 16,
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  };

  const buttonDisabledStyle = {
    cursor: 'not-allowed',
    opacity: 0.6
  };

  const chartContainerStyle = {
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const analysisContainerStyle = {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    border: '1px solid #eee'
  };

  const placeholderStyle = {
    textAlign: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    border: '1px solid #eee',
    color: '#666'
  };

  // Fetch sectors from backend on component mount
  useEffect(() => {
    fetchSectors();
  }, []);

  useEffect(() => {
    // Recalculate analysis whenever percentages or selectedSectors change
    const currentValues = Object.entries(sectorInputs)
      .filter(([name, value]) => selectedSectors.includes(name) && value !== '')
      .map(([name, value]) => Number(value) || 0);

    const avg = currentValues.length ? (currentValues.reduce((a, b) => a + b, 0) / currentValues.length).toFixed(2) : 0;
    const high = currentValues.length ? Math.max(...currentValues).toFixed(2) : 0;
    const low = currentValues.length ? Math.min(...currentValues).toFixed(2) : 0;

    setAverage(avg);
    setHighest(high);
    setLowest(low);

    // Calculate data for the pie chart based on 100% vs <100% uptime
    const count100 = selectedSectors.filter(s => Number(sectorInputs[s]) === 100).length;
    const countLessThan100 = selectedSectors.length - count100;

    setUptime100Count(count100);
    setUptimeLessThan100Count(countLessThan100);

  }, [selectedSectors, sectorInputs]);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      setMessage('');
      const data = await getSectors();
      setSectors(data);
      
      // Initialize sectorInputs only with data from backend for sectors in SECTOR_LIST
      const initialInputs = {};
      const initialSelected = [];
      data.forEach(sector => {
        if (SECTOR_LIST.includes(sector.name)) {
          initialInputs[sector.name] = sector.availability;
          initialSelected.push(sector.name);
        }
      });
      setSectorInputs(initialInputs);

      // Also update selectedSectors to reflect all currently known and filtered sectors
      setSelectedSectors(initialSelected);

    } catch (error) {
      setMessage('Error fetching sectors: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSectorChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options.filter(o => o.selected).map(o => o.value);
    setSelectedSectors(selected);

    // Ensure input fields are only shown for selected sectors
    setSectorInputs(prev => {
      const newInputs = {};
      selected.forEach(s => {
        newInputs[s] = prev[s] !== undefined ? prev[s] : ''; // Keep existing value or set empty
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
      setMessage('Please select at least one sector to save.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      let successCount = 0;
      let errorCount = 0;

      for (const sectorName of selectedSectors) {
        const availability = Number(sectorInputs[sectorName]);

        if (isNaN(availability) || availability < 0 || availability > 100) {
          setMessage(`Invalid availability for ${sectorName}. Please enter a value between 0-100.`);
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
        setMessage(`Successfully saved ${successCount} sectors.`);
      }
      if (errorCount > 0) {
        setMessage(prev => `${prev} Failed to save ${errorCount} sectors.`);
      }

      fetchSectors(); // Refresh data after saving

    } catch (error) {
      setMessage('Error saving selected sectors: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (selectedSectors.length === 0) {
      setMessage('Please select sectors to generate a report.');
      return;
    }

    let csvContent = 'Uplink Availability Report\n\n';

    // Section 1: Overall Analysis
    csvContent += 'Overall Analysis\n';
    csvContent += `Average Availability,%${average}\n`;
    csvContent += `Highest Availability,%${highest}\n`;
    csvContent += `Lowest Availability,%${lowest}\n`;
    csvContent += `Total Selected Sectors,${selectedSectors.length}\n`;
    csvContent += `Uptime = 100% Sectors,${uptime100Count}\n`;
    csvContent += `Uptime < 100% Sectors,${uptimeLessThan100Count}\n\n`;

    // Section 2: Individual Sector Data
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

    setMessage('Report generated successfully!');
  };

  // Prepare data for pie chart
  const pieData = {
    labels: ['Uptime = 100%', 'Uptime < 100%'],
    datasets: [
      {
        data: [uptime100Count, uptimeLessThan100Count],
        backgroundColor: [
          '#4caf50', // Green for 100% Uptime
          '#ffc107', // Gold/Yellow for <100% Uptime
        ],
      },
    ],
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Uplink Availability Dashboard</h2>
      
      <img src={fitlogo} alt="Fit Logo" style={logoStyle} />
      
      {message && (
        <div style={messageStyle(message.includes('Error'))}>
          {message}
        </div>
      )}

      <div style={gridContainerStyle}>
        {/* Left Column - Sector Selection and Input */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="sector-select"><b>Select Sectors for View/Edit:</b></label><br />
            <select
              id="sector-select"
              multiple
              value={selectedSectors}
              onChange={handleSectorChange}
              style={selectStyle}
            >
              {SECTOR_LIST.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            <small style={smallTextStyle}>Hold Ctrl (or Cmd on Mac) to select multiple sectors</small>
          </div>

          {selectedSectors.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={sectionTitleStyle}>Enter/Edit Availability Percentages:</h4>
              {selectedSectors.map(sectorName => (
                <div key={sectorName} style={inputRowStyle}>
                  <label style={inputLabelStyle}>{sectorName}:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={sectorInputs[sectorName] !== undefined ? sectorInputs[sectorName] : ''}
                    onChange={e => handlePercentageChange(sectorName, e.target.value)}
                    style={inputFieldStyle}
                    placeholder="%"
                  />
                  <span>%</span>
                </div>
              ))}
              <button 
                onClick={handleSaveAllSelectedSectors}
                disabled={loading || selectedSectors.length === 0}
                style={loading || selectedSectors.length === 0 ? {...saveButtonStyle, ...buttonDisabledStyle} : saveButtonStyle}
              >
                {loading ? 'Saving...' : 'Save All Selected Sectors'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Chart and Analysis */}
        <div>
          {selectedSectors.length > 0 ? (
            <div>
              <div style={chartContainerStyle}>
                <Pie data={pieData} />
              </div>
              
              <div style={analysisContainerStyle}>
                <h4 style={sectionTitleStyle}>Analysis of Selected Sectors</h4>
                <p><b>Average Availability:</b> {average}%</p>
                <p><b>Highest Availability:</b> {highest}%</p>
                <p><b>Lowest Availability:</b> {lowest}%</p>
                <p><b>Total Selected Sectors:</b> {selectedSectors.length}</p>
                <p>
                  <b>Uptime = 100%:</b> {uptime100Count} sectors ({(selectedSectors.length > 0 ? (uptime100Count / selectedSectors.length * 100).toFixed(0) : 0)}%)
                </p>
                <p>
                  <b>Uptime &lt; 100%:</b> {uptimeLessThan100Count} sectors ({(selectedSectors.length > 0 ? (uptimeLessThan100Count / selectedSectors.length * 100).toFixed(0) : 0)}%)
                </p>
              </div>
            </div>
          ) : (
            <div style={placeholderStyle}>
              <p>Select sectors from the left to view their chart and analysis.</p>
            </div>
          )}
          {selectedSectors.length > 0 && (
            <button
              onClick={handleGenerateReport}
              style={{
                ...saveButtonStyle, // Reusing existing button style
                backgroundColor: '#28a745', // Green for export
                marginTop: 20,
                display: 'block', // Make it a block element to center or give full width
                margin: '20px auto 0 auto' // Center the button
              }}
            >
              Generate Report (CSV)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonitorHome;
