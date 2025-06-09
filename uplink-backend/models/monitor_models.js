const mongoose = require('mongoose');

const SectorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  availability: { type: Number, required: true }
});

module.exports = mongoose.model('Sector', SectorSchema);
