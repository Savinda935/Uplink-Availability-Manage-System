const mongoose = require('mongoose');

const AdvantisSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  firewallIP: { type: String, required: true },
  uptime: { type: Number, required: true }
});

module.exports = mongoose.model('Advantis', AdvantisSchema);
