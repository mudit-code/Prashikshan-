const pool = require('./config/db');

async function debugInsert() {
    try {
        const id = Math.floor(100000000 + Math.random() * 900000000);
        console.log('Generated ID:', id);

        // 1. Insert into register
        await pool.query(
            `INSERT INTO register (id, email, password, role, create_time) VALUES ($1, $2, $3, $4, NOW())`,
            [id, `test_${id}@example.com`, 'hash', 5]
        );
        console.log('Inserted into register');

        // 2. Insert into state_admin
        await pool.query(
            `INSERT INTO state_admin (id, first_name, mid_name, last_name, state) VALUES ($1, $2, $3, $4, $5)`,
            [id, 'Test', null, 'Admin', 'Maharashtra']
        );
        console.log('Inserted into state_admin');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

debugInsert();
