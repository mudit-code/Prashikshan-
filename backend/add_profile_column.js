const pool = require('./config/db');

async function addProfileColumn() {
    try {
        console.log("Checking if profile_data column exists...");
        // Check if column exists
        const checkRes = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='students' AND column_name='profile_data';
        `);

        if (checkRes.rows.length === 0) {
            console.log("Column does not exist. Adding profile_data JSONB column...");
            await pool.query(`ALTER TABLE students ADD COLUMN profile_data JSONB DEFAULT '{}'`);
            console.log("Successfully added profile_data column.");
        } else {
            console.log("profile_data column already exists.");
        }
    } catch (err) {
        console.error("Error adding column:", err);
    }
}

addProfileColumn();
