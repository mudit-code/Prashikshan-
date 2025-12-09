const pool = require('./config/db');

async function verifySchema() {
    try {
        const res = await pool.query('SELECT * FROM students LIMIT 1');
        if (res.rows.length > 0) {
            console.log('Students Table Columns:', Object.keys(res.rows[0]));
            // Also check if there is an education column or table
            // But I can't list tables easily without knowing specific PG commands
        } else {
            console.log('No students found to infer schema.');
            // Check information schema
            const columns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'students'");
            console.log('Students Table Schema:', columns.rows);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

verifySchema();
