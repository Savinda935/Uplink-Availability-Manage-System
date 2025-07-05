const mongoose = require('mongoose');

const FiberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  firewallIP: { type: String, required: true },
  uptime: { type: Number, required: true }
});

module.exports = mongoose.model('Fiber', FiberSchema);
