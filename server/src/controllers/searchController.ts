import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const searchWorkspace = async (req: Request, res: Response) => {
  const query = String(req.query.q ?? "").trim();

  if (!query) {
    return res.json({
      projects: [],
      tasks: [],
      users: [],
      teams: [],
    });
  }

  try {
    const [projects, tasks, users, teams] = await Promise.all([
      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),
      prisma.user.findMany({
        where: {
          username: { contains: query, mode: "insensitive" },
        },
        take: 10,
      }),
      prisma.team.findMany({
        where: {
          teamName: { contains: query, mode: "insensitive" },
        },
        take: 10,
      }),
    ]);

    return res.json({ projects, tasks, users, teams });
  } catch (error) {
    return res.status(500).json({ message: "Error running search", error });
  }
};
