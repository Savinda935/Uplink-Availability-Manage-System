import React, { useState } from 'react';
import { addOrUpdateSector } from '../API';

function AddSectorForm({ onSectorAdded, existingSectors }) {
  const [formData, setFormData] = useState({
    name: '',
    availability: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setMessage('Sector name is required');
      return;
    }

    const availability = Number(formData.availability);
    if (isNaN(availability) || availability < 0 || availability > 100) {
      setMessage('Please enter a valid availability percentage (0-100)');
      return;
    }

    // Check if sector already exists
    const sectorExists = existingSectors.some(sector => 
      sector.name.toLowerCase() === formData.name.toLowerCase()
    );
    
    if (sectorExists) {
      setMessage('This sector already exists. Use the update function instead.');
      return;
    }

    try {
      setLoading(true);
      await addOrUpdateSector(formData.name, availability);
      setMessage('Sector added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        availability: '',
        description: ''
      });
      
      // Notify parent component
      if (onSectorAdded) {
        onSectorAdded();
      }
    } catch (error) {
      setMessage('Error adding sector: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: 20, 
      borderRadius: 8, 
      marginBottom: 20 
    }}>
      <h3>Add New Sector</h3>
      
      {message && (
        <div style={{ 
          padding: 10, 
          marginBottom: 16, 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? '#c62828' : '#2e7d32',
          borderRadius: 4
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: 4 }}>
            <strong>Sector Name:</strong>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter sector name (e.g., PO33)"
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14
            }}
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="availability" style={{ display: 'block', marginBottom: 4 }}>
            <strong>Availability Percentage:</strong>
          </label>
          <input
            type="number"
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            placeholder="Enter percentage (0-100)"
            min="0"
            max="100"
            step="0.01"
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14
            }}
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: 4 }}>
            <strong>Description (Optional):</strong>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter sector description"
            rows="3"
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14,
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Adding...' : 'Add Sector'}
        </button>
      </form>
    </div>
  );
}

export default AddSectorForm; 