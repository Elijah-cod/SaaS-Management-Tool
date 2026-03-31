"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
const isProduction = env_1.env.nodeEnv === "production";
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || env_1.env.clientOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use((0, morgan_1.default)(isProduction ? "combined" : "common"));
app.use(express_1.default.json({ limit: "1mb" }));
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "server",
        environment: env_1.env.nodeEnv,
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});
app.use("/auth", authRoutes_1.default);
app.use("/projects", projectRoutes_1.default);
app.use("/tasks", taskRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/teams", teamRoutes_1.default);
app.use("/search", searchRoutes_1.default);
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Unexpected server error" });
});
app.listen(env_1.env.port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${env_1.env.port}`);
});
//# sourceMappingURL=index.js.map