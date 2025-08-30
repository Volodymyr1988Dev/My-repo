import { videoEnum } from '../../enum/videoEnum';
import pool from '../../utils/pool';
import minimist from 'minimist';


 export async function insertVideo(): Promise<void> {
  const args = minimist(process.argv.slice(2), {
    string: ['title', 'views', 'category'],
    default: {views: '0', category: 'Other'},})
  
    let title = (args.title || '').trim();
    const category = (args.category as videoEnum).trim();

    const viesNum = Number(args.views);
    const views = Number.isFinite(viesNum) ? viesNum : 0;

  if (!title) {
    throw new Error('❌ title is required: --title="Some title"');
  }

  const sql = `
    INSERT INTO videos (title, views, category)
    VALUES ($1, $2, $3)
    RETURNING id, title, views, category;
  `;

  
    const res = await pool.query(sql, [title, views, category]);
    console.log('✅ Video inserted successfully:', res.rows[0]);
}
insertVideo()
.catch ((err) => {
    console.error('❌ Error inserting video:', err);
  }) 
.finally (async () => {
    await pool.end();
  })