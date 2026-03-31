import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        userId: "asc",
      },
    });

    const serializedUsers = users.map((user) => ({
      id: `u${user.userId}`,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.profilePictureUrl,
      teamId: user.teamId,
    }));

    res.json(serializedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
