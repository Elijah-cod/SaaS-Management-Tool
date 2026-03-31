import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import type { NextFunction, Request, Response } from "express";
import projectRoutes from "./routes/projectRoutes";
import searchRoutes from "./routes/searchRoutes";
import taskRoutes from "./routes/taskRoutes";
import teamRoutes from "./routes/teamRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = Number(process.env.PORT) || 4000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("common"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "server",
    timestamp: new Date().toISOString(),
  });
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/search", searchRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
