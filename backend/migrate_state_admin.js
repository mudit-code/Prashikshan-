const pool = require('./config/db');

async function migrate() {
    try {
        console.log("Adding status column to state_admin...");
        await pool.query(`ALTER TABLE state_admin ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';`);
        console.log("Migration complete.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        pool.end();
    }
}

migrate();
