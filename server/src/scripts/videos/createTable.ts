import pool from '../../pool'

export async function createTableVideo(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      views FLOAT4,
      category TEXT
    );
  `;
  await pool.query(sql);
  console.log('Videos table created successfully');
}

createTableVideo().
catch(err => {
  console.error('Error creating videos table:', err);
  process.exit(1);
})
.finally(() => {
  pool.end();
});