const pool = require('./config/db');

async function addLogbookStatusColumn() {
    try {
        await pool.query(`
            ALTER TABLE logbook_entries 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'In Progress';
        `);
        console.log("Status column added to logbook_entries table.");
        process.exit(0);
    } catch (err) {
        console.error("Error adding status column:", err);
        process.exit(1);
    }
}

addLogbookStatusColumn();
