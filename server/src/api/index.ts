import "reflect-metadata";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../app";
import { AppDataSource } from "../utils/DataSource";

let isInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (!isInitialized) {
            await AppDataSource.initialize();
            isInitialized = true;
            console.log("DB connected ✅");
        }
        // передаємо запит у Express
        return app(req as any, res as any);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database connection failed" });
    }
}