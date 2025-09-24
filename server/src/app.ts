import path from "path";

import cors from "cors";
import dotenv from "dotenv";
import express, {Request, Response} from "express";

import { errorHandler } from "./middleware/errorHandler";
import passport from "./passport";
import routes from "./routes/routes"

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use(`${process.env.VITE_API_URL}`, routes);

//const clientBuildPath = path.join(__dirname, "../../client/dist");

//app.use(express.static(clientBuildPath));

app.get("/", (_req, res) => {
  res.send("✅ API is running on Render");
});

//app.get("*", (_req: Request, res: Response) => {
//  res.sendFile(path.join(clientBuildPath, "index.html"));
//});
app.use(errorHandler);

export {app}