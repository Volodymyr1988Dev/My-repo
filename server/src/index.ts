import "reflect-metadata";
//import { execSync } from "child_process";
import http from "http";

import dotenv from 'dotenv';
//import swaggerAutogen from "swagger-autogen";



import {app} from "./app";
dotenv.config();
//import { seedUsers } from "./seed/seedUsers";
import { AppDataSource } from "./utils/DataSource";






const port:number = Number(process.env.PORT) || 10000;
//const HOST = process.env.HOST || 'localhost';

AppDataSource.initialize()
    .then(async() => {
        console.log("DB connected ✅");
        //await seedUsers();
       // execSync("node src/swagger.js", { stdio: "inherit" });
        const server = http.createServer(app);
        //server.listen(port, ()=> {console.log(`🚀 Server running at http://${HOST}:${port}`)});
        server.listen(port, '0.0.0.0', () => {console.log(`🚀 Server running on port ${port}`)});
    })
    .catch((err) => console.error("DB connection error: ", err));