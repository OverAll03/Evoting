const express = require('express');
const cors = require('cors');
const blockchainRoutes = require('./routes/blockchainRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./db');
require('dotenv').config();
const app = express();

connectDB();

app.use(express.json()); 
app.use(cors());

app.use('/api/blockchain', blockchainRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
