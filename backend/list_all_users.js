const pool = require('./config/db');

async function listUsers() {
    try {
        const res = await pool.query(`
            SELECT r.id, r.email, r.role, r.create_time,
                   COALESCE(s.first_name, f.first_name, a.first_name, sa.first_name, e.company_name) as name,
                   COALESCE(s.last_name, f.last_name, a.last_name, sa.last_name, '') as last_name
            FROM register r
            LEFT JOIN students s ON r.id = s.id AND r.role = 1
            LEFT JOIN faculty f ON r.id = f.id AND r.role = 2
            LEFT JOIN admin a ON r.id = a.id AND r.role = 3
            LEFT JOIN employer e ON r.id = e.id AND r.role = 4
            LEFT JOIN state_admin sa ON r.id = sa.id AND r.role = 5
            ORDER BY r.create_time DESC
        `);

        const roles = {
            1: 'Student',
            2: 'Faculty',
            3: 'Admin',
            4: 'Employer',
            5: 'State Admin'
        };

        console.log('--- Registered Users ---');
        res.rows.forEach(user => {
            const roleName = roles[user.role] || 'Unknown';
            const fullName = user.name ? `${user.name} ${user.last_name}`.trim() : 'N/A';
            console.log(`Email: ${user.email} | Role: ${roleName} | Name: ${fullName} | ID: ${user.id}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

listUsers();
