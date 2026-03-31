import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import searchRoutes from "./routes/searchRoutes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/search", searchRoutes);

const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));