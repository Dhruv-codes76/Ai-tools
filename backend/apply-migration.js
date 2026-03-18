const fs = require('fs');
const { Client } = require('pg');

const connectionString = "postgresql://vonny@127.0.0.1:5434/ai_mvp_project";

const client = new Client({
  connectionString
});

async function runMigration() {
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    
    console.log('Connected! Reading migration.sql...');
    const sql = fs.readFileSync('migration.sql', 'utf8');
    
    console.log('Executing migration.sql...');
    await client.query(sql);
    
    console.log('Migration executed successfully!');
    
    // Check tables to verify
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables created:', res.rows.map(r => r.table_name).join(', '));
    
    await client.end();
  } catch (err) {
    console.error('Migration error:', err.stack);
    process.exit(1);
  }
}

runMigration();
