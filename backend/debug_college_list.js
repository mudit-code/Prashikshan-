
const pool = require('./config/db');

async function debugColleges() {
    try {
        console.log("--- College Table ---");
        const colleges = await pool.query("SELECT id, college_name FROM college");
        console.table(colleges.rows);

        console.log("\n--- Admin Table ---");
        const admins = await pool.query("SELECT id, college_name FROM admin");
        console.table(admins.rows);

        console.log("\n--- JOIN Query ---");
        const query = `
      SELECT c.id, c.college_name as "collegeName", a.aishe_code as "aisheCode" 
      FROM college c
      INNER JOIN admin a ON c.college_name = a.college_name
      ORDER BY c.college_name
    `;
        const joined = await pool.query(query);
        console.table(joined.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

debugColleges();
