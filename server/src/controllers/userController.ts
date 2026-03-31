import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const deriveRole = (username: string) => {
  if (username.includes("Amina")) {
    return "Product Manager";
  }
  if (username.includes("Daniel")) {
    return "Frontend Engineer";
  }
  if (username.includes("Lina")) {
    return "Designer";
  }
  if (username.includes("Musa")) {
    return "Operations Lead";
  }

  return "Team Member";
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        userId: "asc",
      },
    });

    const serializedUsers = users.map((user) => ({
      id: `u${user.userId}`,
      name: user.username,
      email: `${user.username.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      role: deriveRole(user.username),
      avatarUrl: user.profilePictureUrl,
      teamId: user.teamId,
    }));

    res.json(serializedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
