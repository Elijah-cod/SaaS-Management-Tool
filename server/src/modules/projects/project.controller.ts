import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { createProjectRecord, listProjects } from "./project.service";

export const getProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await listProjects();
  res.json(projects);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await createProjectRecord(req.body);
  res.status(201).json(project);
});
