import React, { useState, useEffect } from 'react';
import { getSectors, SECTOR_LIST } from '../API';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js v3+ to auto-register components

function AllSectorsTable() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAllSectors = async () => {
      try {
        setLoading(true);
        setMessage('');
        const data = await getSectors();
        // Filter sectors to only include those present in SECTOR_LIST
        const filteredSectors = data.filter(sector => SECTOR_LIST.includes(sector.name));
        setSectors(filteredSectors);
      } catch (error) {
        setMessage('Error fetching all sectors: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSectors();
  }, []);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd'
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa'
  };

  const evenRowStyle = {
    backgroundColor: '#f1f1f1'
  };

  const getAvailabilityColor = (availability) => {
    if (availability === 100) {
      return '#4caf50'; // Green
    } else if (availability >= 90) {
      return '#ffc107'; // Yellow/Gold
    } else {
      return '#dc3545'; // Red
    }
  };

  // Prepare data for the pie chart (Doughnut style)
  const chartData = {
    labels: sectors.map(sector => sector.name),
    datasets: [
      {
        data: sectors.map(sector => sector.availability),
        backgroundColor: sectors.map(sector => getAvailabilityColor(sector.availability)),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      }
    },
    cutout: '70%' // Doughnut hole size
  };

  return (
    <div style={{ padding: '20px', marginLeft: '250px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>All Available Sectors</h2>
      
      {message && (
        <div style={{
          padding: 10,
          marginBottom: 16,
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? '#c62828' : '#2e7d32',
          borderRadius: 4,
          border: `1px solid ${message.includes('Error') ? '#c62828' : '#2e7d32'}`
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading all sectors...</p>
      ) : sectors.length === 0 ? (
        <p>No sectors found in the database matching your predefined list.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
          {/* Pie Chart Section */}
          <div style={{ flex: '1 1 400px', maxWidth: '500px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '15px', color: '#555', textAlign: 'center' }}>Availability Distribution</h3>
            <Doughnut data={chartData} options={chartOptions} />
          </div>

          {/* Table Section */}
          <div style={{ flex: '1 1 500px', overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sector Name</th>
                  <th style={thStyle}>Availability</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((sector, index) => (
                  <tr key={sector._id} style={index % 2 === 0 ? {} : evenRowStyle}>
                    <td style={tdStyle}>{sector.name}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: getAvailabilityColor(sector.availability) }}>
                      {sector.availability}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllSectorsTable; 