const pool = require('./config/db');
const fs = require('fs');

async function checkColumns() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'internships'
        `);
        const json = JSON.stringify(res.rows, null, 2);
        fs.writeFileSync('schema_output.txt', json);
        console.log("Done");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkColumns();
