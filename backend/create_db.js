const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'postgres' // Connect to default database first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');
    
    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'prashikshan'`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE prashikshan;`);
      console.log('Database prashikshan created successfully.');
    } else {
      console.log('Database prashikshan already exists.');
    }
  } catch (err) {
    console.error('Failed to create database:', err.message);
  } finally {
    await client.end();
  }
}

createDb();
