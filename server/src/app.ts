import path from "path";

import cors from "cors";
import express, {Request, Response} from "express";
import swaggerUi from "swagger-ui-express";

import { errorHandler } from "./middleware/errorHandler";
import passport from "./passport";
import routes from "./routes/routes"
import swaggerDocument from "./swagger/swagger-output.json";


const app = express();

app.use(cors({
  origin: ["https://my-repo-front.vercel.app",
    "http://localhost:5173",              
    "https://my-repo-client.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
  res.send("✅ API is running on Render");
});

app.use(errorHandler);

export {app}