const pool = require('./config/db');

async function debugCollegeJoin() {
    try {
        console.log("PostgreSQL pool connected");

        console.log("\n--- Improved Query Result ---");
        const query = `
          SELECT c.id, c.college_name as "collegeName", MAX(a.aishe_code) as "aisheCode" 
          FROM college c
          LEFT JOIN admin a ON c.college_name = a.college_name
          GROUP BY c.id, c.college_name
          ORDER BY c.college_name
        `;
        const result = await pool.query(query);
        console.log(`Total Colleges Found: ${result.rows.length}`);

        if (result.rows.length > 0) {
            console.log("First 5 colleges:");
            console.log(JSON.stringify(result.rows.slice(0, 5), null, 2));
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

debugCollegeJoin();
