import cors from "cors";
import express, {Request, Response} from "express";
import path from "path";
import routes from "./routes/routes"
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
//import passport from "passport";
import passport from "./passport";


const app = express();
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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
//npm run pool:update -- --id=1 --title="Updated title" 
//npm run pool:delete -- --id=1
//npm run pool:byid -- --id=2
//npm run pool:all -- --page=0 --size=5
//npm run pool:insert -- --title="Hello from DB" --text="Enother interesting text" --genre="Other" --isPrivate=false

//npm run pool:videoInsert -- --title='Howdoes it was' --views='500' --category='History'
//npm run pool:videoPaginate -- --page=1 --size=2
//npm run pool:videoFind -- --search="Happy"
//npm run pool:videoGroup