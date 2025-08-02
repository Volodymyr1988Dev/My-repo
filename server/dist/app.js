"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", routes_1.default);
//const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuildPath = path_1.default.resolve("client/build");
//const clientBuildPath = path.join(__dirname, "../../client/build");
app.use(express_1.default.static(clientBuildPath));
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(clientBuildPath, "index.html"));
});
