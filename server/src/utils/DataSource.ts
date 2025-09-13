import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { NewsPost } from "../entities/NewsPost";
import dotenv from "dotenv";

dotenv.config();


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "123456",
  database: process.env.DB_NAME || "newsdb",
  synchronize: true,
  logging: false,
  entities: [User, NewsPost],
  migrations: ["src/migrations/*.ts"],
});