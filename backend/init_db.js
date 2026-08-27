const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

async function initializeDatabase() {
    try {
        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema.sql...');
        await pool.query(schema);

        console.log('Database schema initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await pool.end();
        console.log('Database pool closed.');
    }
}

initializeDatabase();
