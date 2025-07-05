const express = require('express');
const router = express.Router();
const Fiber = require('../models/Fiber_model');

// Get all fibers
router.get('/', async (req, res) => {
  try {
    const fibers = await Fiber.find();
    res.json(fibers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update a fiber
router.post('/', async (req, res) => {
  const { name, firewallIP, uptime } = req.body;
  if (!name || !firewallIP || typeof uptime !== 'number') {
    return res.status(400).json({ error: 'Name, firewallIP, and uptime are required.' });
  }
  try {
    let fiber = await Fiber.findOne({ name });
    if (fiber) {
      fiber.uptime = uptime;
      fiber.firewallIP = firewallIP;
      await fiber.save();
      return res.json(fiber);
    } else {
      fiber = new Fiber({ name, firewallIP, uptime });
      await fiber.save();
      return res.status(201).json(fiber);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk add or update fibers
router.post('/bulk', async (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'Updates must be an array.' });
  }
  try {
    const results = [];
    for (const update of updates) {
      const { name, firewallIP, uptime } = update;
      if (!name || !firewallIP || typeof uptime !== 'number') continue;
      let fiber = await Fiber.findOne({ name });
      if (fiber) {
        fiber.uptime = uptime;
        fiber.firewallIP = firewallIP;
        await fiber.save();
        results.push(fiber);
      } else {
        fiber = new Fiber({ name, firewallIP, uptime });
        await fiber.save();
        results.push(fiber);
      }
    }
    res.json({ updated: results.length, records: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
