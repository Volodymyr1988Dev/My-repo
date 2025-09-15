import cors from "cors";
import express, {Request, Response} from "express";
import path from "path";
import routes from "./routes/routes"
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import passport from "./passport";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(passport.initialize());

app.use("/api", routes);

const clientBuildPath = path.join(__dirname, "../../client/build");

app.use(express.static(clientBuildPath));



app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});
app.use(errorHandler);

export {app}

//PGHOST=localhost
//PGUSER=postgres
//PGPASSWORD=123456
//PGDATABASE=newsdb
//PGPORT=5432
//DB_PASS=123456