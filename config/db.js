const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
  user: 'mr.khasanov02@gmail.com',
  password: '@psql02',
  database: 'user_list',
  port: 5432,
  host: 'localhost',
});

module.exports = pool