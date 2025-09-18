import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";

import { NewsPost } from "../entities/NewsPost";
import { User } from "../entities/User";


dotenv.config();


const isProd = process.env.NODE_ENV === "production";
export const AppDataSource = new DataSource({
  type: "postgres",
  url: isProd ? process.env.DATABASE_URL : undefined,
   host: isProd ? undefined : process.env.PGHOST || "localhost",
  port: isProd ? undefined : Number(process.env.PGPORT) || 5432,
   username: isProd ? undefined : process.env.PGUSER || "postgres",
  password: isProd ? undefined : process.env.PGPASSWORD || "123456",
  database: isProd ? undefined : process.env.PGDATABASE || "newsdb",
  //host: process.env.DB_HOST || "localhost",
  //port: Number(process.env.DB_PORT) || 5432,
  //username: process.env.DB_USER || "postgres",
 // password: process.env.DB_PASS || "123456",
 // database: process.env.DB_NAME || "newsdb",
  synchronize: false,
  logging: false,
  entities: [User, NewsPost],
  migrations: isProd ? ["dist/migration/*.js"] : ["src/migration/*.ts"],
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});