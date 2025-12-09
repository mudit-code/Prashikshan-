const pool = require('../config/db');
const fs = require('fs');

const createInternship = async (req, res) => {
    try {
        const { userId } = req.user; // employer_id
        const {
            title, workMode, location, internshipType, duration,
            stipendType, stipendAmount, skills, openings,
            startDate, applicationDeadline, description, perks,
            eligibility, requirements
        } = req.body;

        const result = await pool.query(
            `INSERT INTO internships 
            (employer_id, title, work_mode, location, internship_type, duration, 
            stipend_type, stipend_amount, skills, openings, start_date, 
            application_deadline, description, perks, eligibility, requirements)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *`,
            [userId, title, workMode, location, internshipType, duration,
                stipendType, stipendAmount, skills, openings, startDate,
                applicationDeadline, description, perks, eligibility, requirements]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating internship:", error);
        res.status(500).json({ error: error.message });
    }
};

const getEmployerInternships = async (req, res) => {
    try {
        const { userId } = req.user;
        console.log("DEBUG: Fetching internships for Employer ID:", userId);

        fs.appendFileSync('debug_internship_log.txt', `[${new Date().toISOString()}] Fetching for UserID: ${userId}\n`);

        // Fetch internships with application count
        const result = await pool.query(`
            SELECT i.*, 
            (SELECT COUNT(*) FROM applications a WHERE a.job_id = i.id) as application_count
            FROM internships i
            WHERE i.employer_id = $1
            ORDER BY i.created_at DESC
        `, [userId]);

        console.log("DEBUG: Found internships count:", result.rows.length);
        fs.appendFileSync('debug_internship_log.txt', `[${new Date().toISOString()}] Found: ${result.rows.length}\n`);

        const internships = result.rows.map(row => ({
            ...row,
            startDate: row.start_date,
            applicationDeadline: row.application_deadline,
            internshipType: row.internship_type,
            workMode: row.work_mode,
            stipendType: row.stipend_type,
            stipendAmount: row.stipend_amount,
            createdAt: row.created_at,
            _count: { applications: parseInt(row.application_count) }
        }));

        res.json(internships);
    } catch (error) {
        console.error("Error fetching employer internships:", error);
        fs.appendFileSync('debug_internship_log.txt', `[${new Date().toISOString()}] ERROR (Employer): ${error.message}\n${error.stack}\n`);
        res.status(500).json({ error: "Failed to fetch internships" });
    }
};

const getAllInternships = async (req, res) => {
    try {
        fs.appendFileSync('debug_internship_log.txt', `[${new Date().toISOString()}] Fetching ALL internships\n`);

        const result = await pool.query(`
            SELECT i.*, e.company_name
            FROM internships i
            JOIN employer e ON i.employer_id = e.id
            WHERE i.status = 'Active'
            ORDER BY i.created_at DESC
        `);

        fs.appendFileSync('debug_internship_log.txt', `[${new Date().toISOString()}] Found ALL: ${result.rows.length}\n`);

        const internships = result.rows.map(row => ({

            ...row,
            companyName: row.company_name,
            startDate: row.start_date,
            applicationDeadline: row.application_deadline,
            internshipType: row.internship_type,
            workMode: row.work_mode,
            stipendType: row.stipend_type,
            stipendAmount: row.stipend_amount,
            createdAt: row.created_at
        }));

        res.json(internships);
    } catch (error) {
        console.error("Error fetching all internships:", error);
        res.status(500).json({ error: "Failed to fetch internships" });
    }
}

module.exports = {
    createInternship,
    getEmployerInternships,
    getAllInternships
};
