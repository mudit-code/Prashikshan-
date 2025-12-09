
const pool = require('./config/db');

async function inspectSchema() {
    try {
        console.log("--- college_student_records Schema ---");
        const res = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'college_student_records';
    `);
        console.table(res.rows);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

inspectSchema();
