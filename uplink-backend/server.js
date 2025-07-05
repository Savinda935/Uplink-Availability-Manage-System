require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const monitorRoutes = require('./routes/monitor_routes');
const advantisRoutes = require('./routes/Advantis_route'); // Import Advantis routes
const fiberRoutes = require('./routes/Fiber_route'); // Import Fiber routes

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/sectors', monitorRoutes);
app.use('/api/advantis', advantisRoutes); // Add Advantis routes
app.use('/api/fiber', fiberRoutes); // Add Fiber routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
