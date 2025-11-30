// server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

const app = express();

// Middleware
app.use(express.json());

// Database connection pool
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// Middleware to expose the pool to routes
// app.use((req, res, next) => {
//   req.pool = pool;
//   next();
// });

// Test Database Connection
// pool.connect()
//   .then(() => console.log('Connected to PostgreSQL database!'))
//   .catch(err => console.error('Database connection error:', err.stack));

// Use API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.send('OmniSuite Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // server.js
// require('dotenv').config();
// const express = require('express');
// const { Pool } = require('pg');

// const app = express();
// app.use(express.json());

// // Database connection pool
// // const pool = new Pool({
// //   user: process.env.DB_USER,
// //   host: process.env.DB_HOST,
// //   database: process.env.DB_NAME,
// //   password: process.env.DB_PASSWORD,
// //   port: process.env.DB_PORT,
// // });

// app.get('/', (req, res) => {
//   res.send('OmniSuite Backend is running!');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
