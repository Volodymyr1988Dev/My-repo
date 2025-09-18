import path from "path";

import cors from "cors";
import express, {Request, Response} from "express";

import { errorHandler } from "./middleware/errorHandler";
import passport from "./passport";
import routes from "./routes/routes"



const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api", routes);

const clientBuildPath = path.join(__dirname, "../../client/dist");

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
 //"migration:generate": "typeorm migration:generate src/migration/action -d dist/utils/DataSource.js",
 //   "migration:run": "typeorm migration:run -d dist/utils/DataSource.js",
 //"migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/utils/DataSource.ts",

 //"migration:run:prod": "node ./node_modules/typeorm/cli.js migration:run -d dist/utils/DataSource.js",