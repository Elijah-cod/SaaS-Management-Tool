import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getTeams = async (_req: Request, res: Response) => {
  try {
    const [teams, users] = await Promise.all([
      prisma.team.findMany({
        orderBy: {
          id: "asc",
        },
      }),
      prisma.user.findMany(),
    ]);

    const serializedTeams = teams.map((team) => ({
      id: team.id,
      name: team.teamName,
      description: "Cross-functional delivery team",
      memberCount: users.filter((user) => user.teamId === team.id).length,
      productOwnerUserId: team.productOwnerUserId,
      projectManagerUserId: team.projectManagerUserId,
    }));

    res.json(serializedTeams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error });
  }
};
