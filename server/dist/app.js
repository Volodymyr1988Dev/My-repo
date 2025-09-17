"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middleware/errorHandler");
const passport_1 = __importDefault(require("./passport"));
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use("/api", routes_1.default);
const clientBuildPath = path_1.default.join(__dirname, "../../client/dist");
app.use(express_1.default.static(clientBuildPath));
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(clientBuildPath, "index.html"));
});
app.use(errorHandler_1.errorHandler);
//PGHOST=localhost
//PGUSER=postgres
//PGPASSWORD=123456
//PGDATABASE=newsdb
//PGPORT=5432
//DB_PASS=123456
