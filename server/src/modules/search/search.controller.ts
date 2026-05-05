import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { searchWorkspaceResources } from "./search.service";

export const searchWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const results = await searchWorkspaceResources(query);
    res.json(results);
  }
);
