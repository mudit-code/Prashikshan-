const pool = require('./config/db');
const fs = require('fs');

async function getLastAdmin() {
    try {
        const res = await pool.query('SELECT r.email, s.first_name, s.state FROM register r JOIN state_admin s ON r.id = s.id ORDER BY r.create_time DESC LIMIT 1');
        const user = res.rows[0];
        console.log('Last State Admin:', user);
        fs.writeFileSync('last_admin_creds.txt', JSON.stringify(user, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

getLastAdmin();
