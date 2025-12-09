
const pool = require('./config/db');
const fs = require('fs');

async function inspectSchema() {
    try {
        let output = "--- Admin Table Schema ---\n";
        const adminSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'admin';
    `);
        output += JSON.stringify(adminSchema.rows, null, 2);

        output += "\n\n--- College Table Schema ---\n";
        const collegeSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'college';
    `);
        output += JSON.stringify(collegeSchema.rows, null, 2);

        fs.writeFileSync('schema.txt', output);
        console.log("Schema written to schema.txt");

    } catch (err) {
        console.error("Error inspecting schema:", err);
    } finally {
        pool.end();
    }
}

inspectSchema();
