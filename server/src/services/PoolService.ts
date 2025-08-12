import pool from '../pool'; 
import { NewsPostProps } from '../interface/NewsPostProps';


function toSnakeCase(s: string) {
  return s.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`).replace(/^_/, '');
}

export async function createNewsTable(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS newsposts (
      id SERIAL PRIMARY KEY,
      title TEXT,
      text TEXT,
      genre TEXT,
      is_private BOOLEAN,
      created_date TIMESTAMP DEFAULT NOW()
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

export async function getPostById(id: number) {
  const sql = `
    SELECT id, title, text, genre, is_private AS "isPrivate", created_date AS "createdDate"
    FROM newsposts WHERE id = $1
  `;
  const res = await pool.query(sql, [id]);
  return res.rows[0];
}

export async function createPost(post: NewsPostProps) {
  const sql = `
    INSERT INTO newsposts (title, text, genre, is_private)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, text, genre, is_private AS "isPrivate", created_date AS "createDate"
  `;
  const res = await pool.query(sql, [
    post.title,
    post.text,
    post.genre ?? null,
    post.isPrivate ?? false,
  ]);
  return res.rows[0];
}

export async function updatePost(id: number, updateData: Record<string, any>) {
  const keys = Object.keys(updateData).filter(k => updateData[k] !== undefined);
  if (keys.length === 0) throw new Error('No fields to update');

  const setFragments = keys.map((k, idx) => `${toSnakeCase(k)} = $${idx + 1}`);
  const values = keys.map(k => updateData[k]);
  const sql = `
    UPDATE newsposts
    SET ${setFragments.join(', ')}
    WHERE id = $${keys.length + 1}
    RETURNING id, title, text, genre, is_private AS "isPrivate", created_date AS "createdDate"
  `;
  const res = await pool.query(sql, [...values, id]);
  return res.rows[0];
}

export async function deletePost(id: number) {
  const res = await pool.query('DELETE FROM newsposts WHERE id = $1 RETURNING id', [id]);
  return res.rows[0];
}

export async function closePool() {
  await pool.end();
}