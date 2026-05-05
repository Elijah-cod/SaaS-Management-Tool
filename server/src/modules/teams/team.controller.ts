import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { listTeams } from "./team.service";

export const getTeams = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listTeams());
});
