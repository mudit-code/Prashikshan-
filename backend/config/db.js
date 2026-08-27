require("dotenv").config();
const { Pool } = require("pg");

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 10,
      idleTimeoutMillis: 30000,
    };

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error("Unexpected PG pool error:", err);
  process.exit(-1);
});

module.exports = pool;
