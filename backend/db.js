// db.js
require('dotenv').config(); // load .env file
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  },
  pool: { min: 0, max: 7 },
});

// Quick connection test at startup
db.raw('SELECT 1')
  .then(() => {
    console.log('Database has been connected');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1); // stop the app if DB is not reachable
  });

module.exports = db;
