const pool = require('./config/db');

async function getLastAdmin() {
    try {
        const res = await pool.query('SELECT r.email, s.first_name, s.state FROM register r JOIN state_admin s ON r.id = s.id ORDER BY r.create_time DESC LIMIT 1');
        console.log('Last State Admin:', res.rows[0]);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

getLastAdmin();
