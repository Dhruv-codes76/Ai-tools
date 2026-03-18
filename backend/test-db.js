const { Client } = require('pg');
const connectionString = "postgresql://postgres:WzTVoddjECGovashLJgZrLYCnbeBgTHa@ballast.proxy.rlwy.net:55052/railway";

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.stack);
    process.exit(1);
  }
}

test();
