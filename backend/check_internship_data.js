const pool = require('./config/db');

async function checkData() {
    try {
        console.log("Checking Internships...");
        const res = await pool.query(`
            SELECT i.id, i.title, i.employer_id, i.status, e.company_name
            FROM internships i
            LEFT JOIN employer e ON i.employer_id = e.id
        `);

        if (res.rows.length === 0) {
            console.log("No internships found.");
        } else {
            console.log("Internships found:");
            res.rows.forEach(r => {
                console.log(`ID: ${r.id}, Title: ${r.title}, EmpID: ${r.employer_id}, Status: ${r.status}, Company: ${r.company_name || 'MISSING'}`);
            });
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
