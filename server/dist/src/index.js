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
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: clientUrl,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("common"));
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "server",
        timestamp: new Date().toISOString(),
    });
});
app.use("/projects", projectRoutes_1.default);
app.use("/tasks", taskRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/teams", teamRoutes_1.default);
app.use("/search", searchRoutes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Unexpected server error" });
});
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
//# sourceMappingURL=index.js.map