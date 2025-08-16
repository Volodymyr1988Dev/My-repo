import pool from '../pool'


export async function createVideoTable(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS videos (
      id iNTEGER SERIAL PRIMARY KEY,
      title TEXT,
      views FLOAT4,
      category TEXT,
    );
  `;
  await pool.query(sql);
}

export async function getAllPosts(params: { page?: number; size?: number } = {}) {
  const page = Number(params.page ?? 0);
  const size = Number(params.size ?? 10);
  const offset = page * size;
  const sql = `
    SELECT
      id,
      title,
      text,
      genre,
      is_private   AS "isPrivate",
      created_date AS "createdDate"
    FROM newsposts
    ORDER BY id DESC
    LIMIT $1 OFFSET $2
  `;
  const res = await pool.query(sql, [size, offset]);
  return res.rows;
}
