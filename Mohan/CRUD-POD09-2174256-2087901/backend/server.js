// Basic Express server setup for CRUD Dashboard backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// REMOVE or comment out MongoDB connection code
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crud_dashboard', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
//
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// Basic route
app.get('/', (req, res) => {
  res.send('CRUD Dashboard Backend Running');
});

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import and use product routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// TODO: Add role-based access, CRUD endpoints, user profile, logging, etc.

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
