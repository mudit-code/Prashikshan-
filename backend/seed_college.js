const pool = require('./config/db');

async function seedCollege() {
    try {
        const res = await pool.query(`
            INSERT INTO college (college_name, state_id, branch, location)
            VALUES ('Dummy Test College of Engineering', 14, 'Computer Science', 'Pune, Maharashtra')
            RETURNING id, college_name;
        `);
        console.log('Successfully seeded college:', res.rows[0]);
    } catch (err) {
        console.error('Error seeding college:', err);
    } finally {
        pool.end();
    }
}

seedCollege();
