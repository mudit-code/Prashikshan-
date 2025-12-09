const pool = require("./config/db");

const deleteTestStudents = async () => {
    try {
        const idRes = await pool.query("SELECT id FROM students WHERE college_name = 'Test College'");
        const ids = idRes.rows.map(row => row.id);

        if (ids.length === 0) {
            console.log("No students to delete.");
            return;
        }

        console.log(`Deleting ${ids.length} students explicitly...`);

        // Dependencies on Student ID
        await pool.query("DELETE FROM applications WHERE student_id = ANY($1)", [ids]);
        try { await pool.query("DELETE FROM logbooks WHERE student_id = ANY($1)", [ids]); } catch (e) { }

        // Dependencies on Register ID (which is same as Student ID)
        await pool.query("DELETE FROM token WHERE token_id = ANY($1)", [ids]);

        // Delete from Students matching Register ID
        console.log("Deleting from students...");
        await pool.query("DELETE FROM students WHERE id = ANY($1)", [ids]);

        // Delete from Register
        console.log("Deleting from register...");
        const res = await pool.query("DELETE FROM register WHERE id = ANY($1)", [ids]);
        console.log(`Success! Deleted ${res.rowCount} users from register.`);

    } catch (err) {
        console.error("DELETE FAILED:", err.message);
        if (err.detail) console.error("Detail:", err.detail);
    } finally {
        pool.end();
    }
};

deleteTestStudents();
