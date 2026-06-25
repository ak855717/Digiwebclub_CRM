const express = require('express');
const cors = require('cors');
const { connectDb } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
const followUpRoutes = require('./routes/followUpRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load MVC routes
app.use('/api', userRoutes);
app.use('/api', leadRoutes);
app.use('/api', followUpRoutes);

// Establish database connection and start Express listening
connectDb().then(() => {
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`MVC Backend server is running on http://localhost:${PORT}`);
    });
  }
}).catch(console.error);

module.exports = app;
