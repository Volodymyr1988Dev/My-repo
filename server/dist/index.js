"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DataSource_1 = require("./utils/DataSource");
const port = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";
console.log("HOST", HOST, port);
DataSource_1.AppDataSource.initialize()
    .then(async () => {
    console.log("DB connected ✅");
    //await seedUsers();
    const server = http_1.default.createServer(app_1.app);
    server.listen(port, () => { console.log(`🚀 Server running at http://${HOST}:${port}`); });
})
    .catch((err) => console.error("DB connection error: ", err));
