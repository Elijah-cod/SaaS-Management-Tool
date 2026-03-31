import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAccessToken, verifyPassword } from "../lib/auth";
import type { AuthenticatedRequest } from "../middleware/auth";

const serializeUser = (user: {
  userId: number;
  email: string;
  name: string;
  role: string;
  profilePictureUrl: string | null;
  teamId: number | null;
}) => ({
  id: `u${user.userId}`,
  email: user.email,
  name: user.name,
  role: user.role,
  avatarUrl: user.profilePictureUrl,
  teamId: user.teamId,
});

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = createAccessToken(user);

    return res.json({
      accessToken,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error signing in", error });
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.authUser) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: req.authUser.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(serializeUser(user));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching current user", error });
  }
};
