const pool = require('./config/db');

async function createStudentRecordsTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS college_student_records (
                id SERIAL PRIMARY KEY,
                college_name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                mobile_number VARCHAR(20),
                roll_no VARCHAR(50),
                student_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(query);
        console.log("Table 'college_student_records' created successfully.");
    } catch (err) {
        console.error("Error creating table:", err);
    }
}

createStudentRecordsTable();
