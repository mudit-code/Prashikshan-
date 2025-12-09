const pool = require('./config/db');

async function createLogbookTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS logbook_entries (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES students(id),
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Logbook table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating logbook table:", err);
        process.exit(1);
    }
}

createLogbookTable();
