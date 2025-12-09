const pool = require("./config/db");

const addCollege = async () => {
    try {
        console.log("Attempting to add Test College...");
        // Try inserting without ID first (assuming SERIAL/AUTO_INCREMENT)
        const query = "INSERT INTO college (college_name, branch, location) VALUES ($1, $2, $3) RETURNING *";
        const values = ["Test College", "Computer Science", "Test Location"];
        const res = await pool.query(query, values);
        console.log("Successfully added college:", res.rows[0]);
    } catch (err) {
        console.error("Error adding college:", err.message);
        // If error is about missing ID, try with explicit ID
        if (err.message.includes("null value in column \"id\"") || err.message.includes("violates not-null constraint")) {
            try {
                console.log("Retrying with explicit ID 101...");
                const queryId = "INSERT INTO college (id, college_name, branch, location) VALUES ($1, $2, $3, $4) RETURNING *";
                const valuesId = [101, "Test College", "Computer Science", "Test Location"];
                const resId = await pool.query(queryId, valuesId);
                console.log("Successfully added college with ID 101:", resId.rows[0]);
            } catch (retryErr) {
                console.error("Retry failed:", retryErr.message);
            }
        }
    } finally {
        // Allow time for logs to flush before exiting if needed, though usually not required for pool.end()
        await pool.end();
    }
};

addCollege();
