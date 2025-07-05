import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getFiberRecords, saveFiberUptime } from '../API';
import AmchartsPie3D from '../components/AmchartsPie3D';

const FIBER_LIST = [
  { name: 'Fiber-Chas.P Galle', firewallIP: '10.40.10.0' },
  { name: 'Fiber-Chas.P Madampe', firewallIP: '10.40.8.0' },
  { name: 'Fiber-Chas.P Naththandiya', firewallIP: '10.40.44.0' },
  { name: 'Fiber-Creative Polymat', firewallIP: '10.40.12.0' },
  { name: 'Fiber-Kuliyapitiya', firewallIP: '10.40.29.0' },
  { name: 'Fiber-Ravi Industries', firewallIP: '10.40.14.0' },
  { name: 'Fiber-Rileys Katana', firewallIP: '10.40.15.0' },
  { name: 'Fiber-Volanka Kotugoda', firewallIP: '10.40.17.0' },
];

export default function Fiber() {
  const [fiberList, setFiberList] = useState([]);
  const [uptimeInputs, setUptimeInputs] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchFiber = async () => {
    try {
      setLoading(true);
      const dbRecords = await getFiberRecords();
      const mergedList = FIBER_LIST.map((item) => {
        const found = dbRecords.find((record) => record.name === item.name);
        return {
          ...item,
          uptime: found ? found.uptime : 0,
          _id: found ? found._id : item.name,
        };
      });
      setFiberList(mergedList);
      const uptimes = {};
      mergedList.forEach((a) => {
        uptimes[a._id] = a.uptime ?? 0;
      });
      setUptimeInputs(uptimes);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error fetching Fiber records', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiber(); }, []);

  const handleUptimeChange = (id, value) => {
    setUptimeInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveUptime = async (fiber) => {
    const uptime = uptimeInputs[fiber._id];
    if (uptime === '' || isNaN(uptime) || uptime < 0 || uptime > 100) {
      Swal.fire({ icon: 'warning', title: 'Invalid Uptime', text: 'Please enter a valid uptime percentage (0-100).' });
      return;
    }
    try {
      setLoading(true);
      await saveFiberUptime({
        name: fiber.name,
        firewallIP: fiber.firewallIP,
        uptime: parseFloat(uptime),
      });
      Swal.fire({ icon: 'success', title: 'Success', text: 'Uptime updated successfully.' });
      fetchFiber();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to update uptime.' });
    } finally {
      setLoading(false);
    }
  };

  // Pie chart data logic
  const uptime100Count = fiberList.filter(f => Number(f.uptime) === 100).length;
  const uptimeLessThan100Count = fiberList.length - uptime100Count;
  const pieData = fiberList.map(f => ({
    category: `${f.name} (${f.firewallIP})`,
    value: Number(f.uptime) || 0
  }));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', marginLeft: '250px' }}>
      <h1>Fiber Management</h1>
      <h2>Fiber Records</h2>

      {/* Pie chart: Uptime 100% vs <100% */}
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
            {fiberList.map((fiber) => (
              <tr key={fiber._id}>
                <td>{fiber.name}</td>
                <td>{fiber.firewallIP}</td>
                <td>
                  <input
                    type="number"
                    value={uptimeInputs[fiber._id] ?? 0}
                    onChange={(e) => handleUptimeChange(fiber._id, e.target.value)}
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
                    onClick={() => handleSaveUptime(fiber)}
                    style={{
                      padding: '6px 16px',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
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
