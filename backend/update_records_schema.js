const pool = require('./config/db');

async function updateSchema() {
    try {
        console.log("Updating college_student_records schema...");

        // Add columns if they don't exist
        await pool.query(`
      ALTER TABLE college_student_records 
      ADD COLUMN IF NOT EXISTS course VARCHAR(255),
      ADD COLUMN IF NOT EXISTS current_year VARCHAR(50),
      ADD COLUMN IF NOT EXISTS section VARCHAR(50);
    `);

        console.log("Schema updated successfully.");
    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        pool.end();
    }
}

updateSchema();
