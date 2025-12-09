
const pool = require('./config/db');

async function addColumns() {
    try {
        console.log("Adding columns to 'admin' table...");
        await pool.query(`
      ALTER TABLE admin 
      ADD COLUMN IF NOT EXISTS designation VARCHAR(255),
      ADD COLUMN IF NOT EXISTS department VARCHAR(255),
      ADD COLUMN IF NOT EXISTS official_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS alternate_mobile_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
    `);

        console.log("Adding columns to 'college' table...");
        await pool.query(`
      ALTER TABLE college 
      ADD COLUMN IF NOT EXISTS college_code VARCHAR(100),
      ADD COLUMN IF NOT EXISTS university VARCHAR(255),
      ADD COLUMN IF NOT EXISTS college_type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS college_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS establishment_year VARCHAR(50),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS district VARCHAR(100),
      ADD COLUMN IF NOT EXISTS pincode VARCHAR(20),
      ADD COLUMN IF NOT EXISTS state VARCHAR(100),
      ADD COLUMN IF NOT EXISTS website_url VARCHAR(255);
    `);

        console.log("Columns added successfully!");
    } catch (err) {
        console.error("Error adding columns:", err);
    } finally {
        pool.end();
    }
}

addColumns();
