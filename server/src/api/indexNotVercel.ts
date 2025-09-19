import "reflect-metadata";
import http from "http";

import dotenv from 'dotenv';

import {app} from "../app";
dotenv.config();
//import { seedUsers } from "./seed/seedUsers";
import { AppDataSource } from "../utils/DataSource";



const port = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";
console.log("HOST", HOST, port);

AppDataSource.initialize()
    .then(async() => {
        console.log("DB connected ✅");
        //await seedUsers();
        const server = http.createServer(app);
        server.listen(port, ()=> {console.log(`🚀 Server running at http://${HOST}:${port}`)});
    })
    .catch((err) => console.error("DB connection error: ", err));