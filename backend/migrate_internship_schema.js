const pool = require('./config/db');

async function migrate() {
    try {
        console.log("Adding missing columns to internships table...");
        await pool.query(`
            ALTER TABLE internships
            ADD COLUMN IF NOT EXISTS work_mode VARCHAR(50),
            ADD COLUMN IF NOT EXISTS location VARCHAR(100),
            ADD COLUMN IF NOT EXISTS internship_type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS duration VARCHAR(50),
            ADD COLUMN IF NOT EXISTS stipend_type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS stipend_amount VARCHAR(50),
            ADD COLUMN IF NOT EXISTS skills TEXT,
            ADD COLUMN IF NOT EXISTS openings INTEGER DEFAULT 1,
            ADD COLUMN IF NOT EXISTS start_date DATE,
            ADD COLUMN IF NOT EXISTS application_deadline DATE,
            ADD COLUMN IF NOT EXISTS perks TEXT,
            ADD COLUMN IF NOT EXISTS eligibility TEXT,
            ADD COLUMN IF NOT EXISTS requirements TEXT
        `);
        console.log("Columns added successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration error:", err);
        process.exit(1);
    }
}

migrate();
