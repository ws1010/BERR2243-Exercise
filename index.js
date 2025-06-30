// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Test route
app.get('/', (req, res) => {
  res.send('MyTaxi backend is running 🚕');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const rideRoutes = require('./routes/rideRoutes');
app.use('/api/rides', rideRoutes);
