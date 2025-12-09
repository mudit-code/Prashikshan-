
const pool = require('./config/db');

async function debugColleges() {
    try {
        console.log("--- College Table ---");
        const colleges = await pool.query("SELECT id, college_name FROM college");
        console.log(JSON.stringify(colleges.rows, null, 2));

        console.log("\n--- Admin Table ---");
        const admins = await pool.query("SELECT id, college_name FROM admin");
        console.log(JSON.stringify(admins.rows, null, 2));

        console.log("\n--- JOIN Query ---");
        const query = `
      SELECT c.id, c.college_name as "collegeName", a.aishe_code as "aisheCode" 
      FROM college c
      INNER JOIN admin a ON c.college_name = a.college_name
      ORDER BY c.college_name
    `;
        const joined = await pool.query(query);
        console.log(JSON.stringify(joined.rows, null, 2));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

debugColleges();
