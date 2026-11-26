const mysql = require('mysql2/promise');

// One shared pool for the whole app. mysql2 lends out a free
// connection for each query and takes it back when the query is done.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

// Runs a prepared statement. The values in `params` replace the ? marks
// and are sent separately, so they are never treated as SQL code.
async function query(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

module.exports = { pool, query };
