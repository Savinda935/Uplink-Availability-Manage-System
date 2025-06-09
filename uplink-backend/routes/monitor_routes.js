const express = require('express');
const router = express.Router();
const Sector = require('../models/monitor_models');

// Get all sectors
router.get('/', async (req, res) => {
  try {
    const sectors = await Sector.find();
    res.json(sectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update a sector
router.post('/', async (req, res) => {
  const { name, availability } = req.body;
  if (!name || typeof availability !== 'number') {
    return res.status(400).json({ error: 'Name and availability are required.' });
  }
  try {
    let sector = await Sector.findOne({ name });
    if (sector) {
      sector.availability = availability;
      sector.updatedAt = Date.now();
      await sector.save();
      return res.json(sector);
    } else {
      sector = new Sector({ name, availability });
      await sector.save();
      return res.status(201).json(sector);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a sector by id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Sector.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Sector not found.' });
    res.json({ message: 'Sector deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
