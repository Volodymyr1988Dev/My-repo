import { assert } from 'node:console';
import pool from '../../pool';

export async function createTableGroup() {
    const sql = `
        SELECT
      COALESCE(category, 'no category') AS category,
      SUM(views) AS total_views
    FROM videos
    GROUP BY category
    ORDER BY total_views DESC;
    `;
    const res = await pool.query(sql);
    console.log('Views by category:');
    for (const row of res.rows) {
        console.log(`${row.category} - ${row.total_views}`);
    }
}

createTableGroup()
    .catch(err => {
        console.error('Error creating groups table:', err);
        process.exit(1);
    })
    .finally(() => {
        pool.end();
    });
    