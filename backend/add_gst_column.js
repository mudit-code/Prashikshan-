const pool = require('./config/db');

async function addGstColumn() {
    try {
        console.log("Checking if gst_number column exists in employer table...");
        const checkRes = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='employer' AND column_name='gst_number';
        `);

        if (checkRes.rows.length === 0) {
            console.log("Column does not exist. Adding gst_number column...");
            await pool.query(`ALTER TABLE employer ADD COLUMN gst_number VARCHAR(20)`);
            console.log("Successfully added gst_number column.");
        } else {
            console.log("gst_number column already exists.");
        }
        process.exit(0);
    } catch (err) {
        console.error("Error adding column:", err);
        process.exit(1);
    }
}

addGstColumn();
