const express = require('express');
const router = express.Router();
const Advantis = require('../models/Advantis_model');

// Predefined Advantis list
const ADVANTIS_LIST = [
  { name: 'ADV-3PL-Kelaniya', firewallIP: '10.40.25.0' },
  { name: 'ADV-3PL-Kotugoda', firewallIP: '10.40.79.0' },
  { name: 'ADV-Expelogixs', firewallIP: '10.40.53.0' },
  { name: 'ADV-Hayleys Free Zone 1-Venus', firewallIP: '10.40.41.0' },
  { name: 'ADV-Hayleys Free Zone 2-Mecury', firewallIP: '10.40.16.0' },
  { name: 'ADV-Logiwiz Kelanimulla', firewallIP: '10.40.35.0' }
];

// Get all Advantis records (always show all, with uptimes if set)
router.get('/', async (req, res) => {
  try {
    const dbRecords = await Advantis.find();
    const result = ADVANTIS_LIST.map(item => {
      const found = dbRecords.find(r => r.name === item.name);
      return {
        name: item.name,
        firewallIP: item.firewallIP,
        uptime: found ? found.uptime : 0,
        _id: found ? found._id : item.name // fallback id
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update an Advantis record (only allow updating uptime for predefined names)
router.post('/', async (req, res) => {
  const { name, firewallIP, uptime } = req.body;
  if (
    !name ||
    !firewallIP ||
    typeof uptime !== 'number' ||
    !ADVANTIS_LIST.some(a => a.name === name && a.firewallIP === firewallIP)
  ) {
    return res.status(400).json({ error: 'Name, Firewall IP, and Uptime are required and must match predefined Advantis.' });
  }
  try {
    let advantisRecord = await Advantis.findOne({ name });
    if (advantisRecord) {
      advantisRecord.uptime = uptime;
      advantisRecord.updatedAt = Date.now();
      await advantisRecord.save();
      return res.json(advantisRecord);
    } else {
      advantisRecord = new Advantis({ name, firewallIP, uptime });
      await advantisRecord.save();
      return res.status(201).json(advantisRecord);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an Advantis record by id (optional, can be left as is)
router.delete('/:id', async (req, res) => {
  try {
    const result = await Advantis.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Advantis record not found.' });
    res.json({ message: 'Advantis record deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
