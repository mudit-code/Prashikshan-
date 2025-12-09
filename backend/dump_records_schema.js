
const pool = require('./config/db');
const fs = require('fs');

async function inspectSchema() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'college_student_records';
    `);

        let output = "Column Name | Data Type | Nullable\n";
        output += "---|---|---\n";
        res.rows.forEach(row => {
            output += `${row.column_name} | ${row.data_type} | ${row.is_nullable}\n`;
        });

        fs.writeFileSync('records_schema.txt', output);
        console.log("Schema dumped to records_schema.txt");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

inspectSchema();
