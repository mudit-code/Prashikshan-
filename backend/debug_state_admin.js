const pool = require('./config/db');

async function debugStateAdmin() {
    try {
        console.log('--- Register Table (Role 5) ---');
        const registers = await pool.query('SELECT * FROM register WHERE role = 5');
        console.table(registers.rows);

        console.log('\n--- State Admin Table ---');
        const admins = await pool.query('SELECT * FROM state_admin');
        console.table(admins.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

debugStateAdmin();
