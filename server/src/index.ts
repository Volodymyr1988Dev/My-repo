import http from "http";
import {app} from "./app";
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";
console.log("HOST", HOST, port);


const server = http.createServer(app);
server.listen(port, ()=> {console.log(`🚀 Server running at http://${HOST}:${port}`)});
