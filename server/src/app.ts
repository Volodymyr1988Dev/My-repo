import cors from "cors";
import express, {Request, Response} from "express";
import path from "path";
import routes from "./routes/routes"


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);


const clientBuildPath = path.join(__dirname, "../../client/build");

app.use(express.static(clientBuildPath));

app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
});


export {app}
