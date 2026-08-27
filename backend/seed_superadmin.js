const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function seedSuperAdmin() {
    try {
        console.log('Seeding Super Admin...');
        const email = 'superadmin@example.com';
        const password = 'admin'; // simple for testing
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = 6; // 6 is Super Admin

        // Generate a random ID to act as the primary key
        const id = Math.floor(Math.random() * 1000000000);

        await pool.query(`
            INSERT INTO register (id, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING;
        `, [id, email, hashedPassword, role]);

        console.log(`Super Admin seeded!`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Open the app, press Ctrl + Shift + A, and login under the Super Admin tab.`);
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        pool.end();
    }
}

seedSuperAdmin();
