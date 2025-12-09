const pool = require("./config/db");

const checkStats = async () => {
    try {
        // Wait for connection noise
        await new Promise(r => setTimeout(r, 1000));

        console.log("\n\n----------------- STATS CHECK -----------------");

        const globalCount = await pool.query("SELECT COUNT(*) FROM students");
        console.log(`Global Student Count: ${globalCount.rows[0].count}`);

        const testCollegeCount = await pool.query("SELECT COUNT(*) FROM students WHERE college_name = 'Test College'");
        console.log(`Test College Student Count: ${testCollegeCount.rows[0].count}`);

        const globalAdmins = await pool.query("SELECT COUNT(*) FROM admin");
        console.log(`Global Admin Count: ${globalAdmins.rows[0].count}`);

        console.log("-----------------------------------------------\n\n");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
};

checkStats();
