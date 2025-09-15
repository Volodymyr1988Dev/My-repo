import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { NewsPost } from "./entities/NewsPost";


dotenv.config();

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migration/*.js"],
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});