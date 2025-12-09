const pool = require("./config/db");

const createTable = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS state_admin (
        id BIGINT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        mid_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id) REFERENCES register(id) ON DELETE CASCADE
      );
    `);
        console.log("state_admin table created successfully");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        pool.end();
    }
};

createTable();
