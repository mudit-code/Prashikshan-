const pool = require('./config/db');

async function checkColumns() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'applications'
        `);
        console.log("APPLICATIONS COLUMNS:");
        res.rows.forEach(r => console.log(`- ${r.column_name}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkColumns();
