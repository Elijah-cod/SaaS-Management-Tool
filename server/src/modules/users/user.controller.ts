import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { listUsers } from "./user.service";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await listUsers());
});
