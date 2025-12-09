const pool = require('./config/db');

async function checkInternshipTable() {
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'internships'
        `);

        if (res.rows.length === 0) {
            console.log("Internships table does not exist. Creating...");
            await pool.query(`
                CREATE TABLE internships (
                    id SERIAL PRIMARY KEY,
                    employer_id INTEGER REFERENCES employer(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    work_mode VARCHAR(50),
                    location VARCHAR(100),
                    internship_type VARCHAR(50),
                    duration VARCHAR(50),
                    stipend_type VARCHAR(50),
                    stipend_amount VARCHAR(50),
                    skills TEXT,
                    openings INTEGER DEFAULT 1,
                    start_date DATE,
                    application_deadline DATE,
                    description TEXT,
                    perks TEXT,
                    eligibility TEXT,
                    requirements TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(20) DEFAULT 'Active'
                )
            `);
            console.log("Internships table created.");
        } else {
            console.log("Internships table exists.");
            // Check columns
            const cols = await pool.query(`
                SELECT column_name FROM information_schema.columns WHERE table_name='internships'
            `);
            console.log("Columns:", cols.rows.map(r => r.column_name));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkInternshipTable();
