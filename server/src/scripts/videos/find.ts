import pool from '../../utils/pool';
import minimist from 'minimist';


export async function findVideo() {
    const args = minimist(process.argv.slice(2), {
        string: ['search']
});
    const search = (args.search || '').trim();

    if (!search) {
        throw new Error('❌ Search term is required: --search="keyword"');
    }

    const sql = `
        SELECT id, title, views, category
        FROM videos
        WHERE title ILIKE $1
        ORDER BY id DESC;
    `;

    const res = await pool.query(sql, [`%${search}%`]);
    
    if (res.rows.length === 0) {
        console.log('🔍 No videos found matching:', search);
    } else {
        console.log(`✅ Found ${res.rows.length} video(s) matching "${search}":`);
        console.log(JSON.stringify(res.rows, null, 2));
    }
}

findVideo()
    .catch(err => {
        console.error('❌ Error finding videos:', err);
    })
    .finally(async () => {
        await pool.end();
    });
