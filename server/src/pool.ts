import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT)
});

export default pool;
/*
const pool = new Pool({
  user: "postgres", // або newsUser
  host: "localhost",
  database: "postgres",
  password: "123456",
  port: 5432,
  ssl: false // <-- додаємо це
});
*/