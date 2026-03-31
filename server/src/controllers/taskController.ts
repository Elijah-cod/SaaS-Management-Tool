import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getTasks = async (req: Request, res: Response) => {
  const projectId = Number(req.query.projectId);

  try {
    const tasks = await prisma.task.findMany({
      where: Number.isNaN(projectId) ? undefined : { projectId },
      orderBy: {
        id: "asc",
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};
