const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool
  .connect()
  .then(() =>
    console.log("✅🔥 Connected to SQL Server via SQL Authentication")
  )
  .catch((err) => console.log("❌ DB Connection Error:", err));

module.exports = { sql, pool, poolConnect };
