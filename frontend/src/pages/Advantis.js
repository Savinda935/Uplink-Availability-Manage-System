import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import AmchartsPie3D from '../components/AmchartsPie3D';
import { saveAdvantisUptime } from '../API';

const API_BASE = 'http://localhost:5000/api/advantis';

const ADVANTIS_LIST = [
  { name: 'ADV-3PL-Kelaniya', firewallIP: '10.40.25.0' },
  { name: 'ADV-3PL-Kotugoda', firewallIP: '10.40.79.0' },
  { name: 'ADV-Expelogixs', firewallIP: '10.40.53.0' },
  { name: 'ADV-Hayleys Free Zone 1-Venus', firewallIP: '10.40.41.0' },
  { name: 'ADV-Hayleys Free Zone 2-Mecury', firewallIP: '10.40.16.0' },
  { name: 'ADV-Logiwiz Kelanimulla', firewallIP: '10.40.35.0' },
];

export default function Advantis() {
  const [advantisList, setAdvantisList] = useState([]);
  const [uptimeInputs, setUptimeInputs] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAdvantis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      const dbRecords = response.data;

      // Merge predefined list with database records
      const mergedList = ADVANTIS_LIST.map((item) => {
        const found = dbRecords.find((record) => record.name === item.name);
        return {
          ...item,
          uptime: found ? found.uptime : 0,
          _id: found ? found._id : item.name, // Use name as fallback ID
        };
      });

      setAdvantisList(mergedList);

      // Initialize uptime inputs
      const uptimes = {};
      mergedList.forEach((a) => {
        uptimes[a._id] = a.uptime ?? 0;
      });
      setUptimeInputs(uptimes);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error fetching Advantis records',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvantis();
  }, []);

  const handleUptimeChange = (id, value) => {
    setUptimeInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveUptime = async (advantis) => {
    const uptime = uptimeInputs[advantis._id];
    if (uptime === '' || isNaN(uptime) || uptime < 0 || uptime > 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Uptime',
        text: 'Please enter a valid uptime percentage (0-100).',
      });
      return;
    }
    try {
      setLoading(true);
      await saveAdvantisUptime({
        name: advantis.name,
        firewallIP: advantis.firewallIP,
        uptime: parseFloat(uptime),
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Uptime updated successfully.',
      });
      fetchAdvantis();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update uptime.',
      });
    } finally {
      setLoading(false);
    }
  };

  // For original chart
  const uptime100Count = advantisList.filter(a => Number(a.uptime) === 100).length;
  const uptimeLessThan100Count = advantisList.length - uptime100Count;

  // For new chart
  const pieData = advantisList.map(a => ({
    category: `${a.name} (${a.firewallIP})`,
    value: Number(a.uptime) || 0
  }));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', marginLeft: '250px'}}>
      <h1>Advantis Management</h1>
      <h2>Advantis Records</h2>

      {/* Original pie chart: Uptime 100% vs <100% */}
      <div style={{ maxWidth: 1500, margin: '0 auto 40px auto' }}>
        <h3>Uptime Distribution (100% vs &lt;100%)</h3>
        <AmchartsPie3D
          uptime100Count={uptime100Count}
          uptimeLessThan100Count={uptimeLessThan100Count}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Firewall IP</th>
              <th>Uptime</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {advantisList.map((advantis) => (
              <tr key={advantis._id}>
                <td>{advantis.name}</td>
                <td>{advantis.firewallIP}</td>
                <td>
                  <input
                    type="number"
                    value={uptimeInputs[advantis._id] ?? 0}
                    onChange={(e) => handleUptimeChange(advantis._id, e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    style={{ padding: '5px', width: '100px' }}
                    disabled={loading}
                  />
                  %
                </td>
                <td>
                  <button
                    onClick={() => handleSaveUptime(advantis)}
                    style={{ padding: '6px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
                    disabled={loading}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
