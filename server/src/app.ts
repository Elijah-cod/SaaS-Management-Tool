import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import searchRoutes from "./routes/searchRoutes";
import taskRoutes from "./routes/taskRoutes";
import teamRoutes from "./routes/teamRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./shared/http/error-handler";
import { notFoundHandler } from "./shared/http/not-found-handler";
import { asyncHandler } from "./shared/http/async-handler";
import { prisma } from "./shared/database/prisma";

export const createApp = () => {
  const app = express();
  const isProduction = env.nodeEnv === "production";

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.clientOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed"));
      },
      credentials: true,
    })
  );
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(morgan(isProduction ? "combined" : "common"));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "server",
      environment: env.nodeEnv,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  app.get(
    "/ready",
    asyncHandler(async (_req, res) => {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        status: "ready",
        service: "server",
        database: "connected",
        timestamp: new Date().toISOString(),
      });
    })
  );

  app.use("/auth", authRoutes);
  app.use("/projects", projectRoutes);
  app.use("/tasks", taskRoutes);
  app.use("/users", userRoutes);
  app.use("/teams", teamRoutes);
  app.use("/search", searchRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();

export default app;
