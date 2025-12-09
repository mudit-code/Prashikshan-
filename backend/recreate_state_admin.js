const pool = require('./config/db');

async function recreateTable() {
    try {
        await pool.query('DROP TABLE IF EXISTS state_admin');
        console.log('Dropped state_admin');

        await pool.query(`
      CREATE TABLE state_admin (
        id BIGINT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        mid_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id) REFERENCES register(id) ON DELETE CASCADE
      );
    `);
        console.log('Recreated state_admin');

        // Verify schema
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'state_admin'");
        console.log('Columns:', res.rows.map(r => r.column_name));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

recreateTable();
