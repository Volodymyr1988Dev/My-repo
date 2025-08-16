import pool from '../../pool';
import minimist from 'minimist';

export async function videoPaginate() {
  const args = minimist(process.argv.slice(2), {
    string: ['page', 'size'],
    default: { page: '1', size: '10' }
  });

  const page = Math.max(1, Number(args.page) || 1);
  const size = Math.max(1, Number(args.size) || 10);
  const offset = (page - 1) * size;

  const sql = `
    SELECT id, title, views, category
    FROM videos
    ORDER BY id DESC
    LIMIT $1 OFFSET $2
  `;
  const res = await pool.query(sql, [size, offset]);

  console.log(`✅ Page ${page}, size ${size}, rows: ${res.rows.length}`);
  console.log(JSON.stringify(res.rows, null, 2));
}

videoPaginate()
  .catch(err => {
    console.error('❌ paginate failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
