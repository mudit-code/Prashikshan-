const pool = require("./config/db");

const listStudents = async () => {
    try {
        await new Promise(r => setTimeout(r, 1000));
        console.log("Listing students for Test College:");
        // Removed email
        const res = await pool.query("SELECT first_name, last_name FROM students WHERE college_name = 'Test College' LIMIT 5");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("Error executing query:", err.message);
    } finally {
        pool.end();
    }
};

listStudents();
