import { prisma } from "../../shared/database/prisma";
import { AppError } from "../../shared/errors/app-error";
import { verifyPassword } from "../../shared/auth/password";
import { createAccessToken } from "../../shared/auth/token";
import { serializeUser } from "./auth.serializer";

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password", {
      code: "INVALID_CREDENTIALS",
    });
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError(401, "Invalid email or password", {
      code: "INVALID_CREDENTIALS",
    });
  }

  return {
    accessToken: createAccessToken(user),
    user: serializeUser(user),
  };
};

export const getAuthenticatedUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found", {
      code: "USER_NOT_FOUND",
    });
  }

  return serializeUser(user);
};
