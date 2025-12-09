const pool = require('./config/db');

async function addEmployerProfileColumn() {
    try {
        console.log("Checking if profile_data column exists in employer table...");
        const checkRes = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='employer' AND column_name='profile_data';
        `);

        if (checkRes.rows.length === 0) {
            console.log("Column does not exist. Adding profile_data JSONB column...");
            await pool.query(`ALTER TABLE employer ADD COLUMN profile_data JSONB DEFAULT '{}'`);
            console.log("Successfully added profile_data column.");
        } else {
            console.log("profile_data column already exists within employer table.");
        }
        process.exit(0);
    } catch (err) {
        console.error("Error adding column:", err);
        process.exit(1);
    }
}

addEmployerProfileColumn();
