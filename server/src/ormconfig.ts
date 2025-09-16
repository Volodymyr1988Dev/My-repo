import dotenv from "dotenv";
import { DataSource } from "typeorm";

//import { NewsPost } from "./entities/NewsPost";
//import { User } from "./entities/User";


dotenv.config();

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migration/*.js"],
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});