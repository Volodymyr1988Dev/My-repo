import "reflect-metadata";
import http from "http";
import {app} from "./app";
import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from "./middleware/DataSource";

const port = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";
console.log("HOST", HOST, port);


//const server = http.createServer(app);
//server.listen(port, ()=> {console.log(`🚀 Server running at http://${HOST}:${port}`)});

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected ✅");
    const server = http.createServer(app);
    server.listen(port, ()=> {console.log(`🚀 Server running at http://${HOST}:${port}`)});
    //app.listen(3000, () => console.log("Server running on 3000"));
  })
  .catch((err) => console.error("DB connection error: ", err));