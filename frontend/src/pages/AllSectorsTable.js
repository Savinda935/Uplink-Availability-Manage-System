import React, { useState, useEffect } from 'react';
import { getSectors, SECTOR_LIST } from '../API';

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
      )}
    </div>
  );
}

export default AllSectorsTable; 