import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import type { AuthenticatedRequest } from "../../middleware/auth";
import { AppError } from "../../shared/errors/app-error";
import {
  authenticateUser,
  getAuthenticatedUser,
  refreshUserSession,
} from "./auth.service";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    throw new AppError(400, "Email and password are required", {
      code: "INVALID_LOGIN_PAYLOAD",
    });
  }

  const sessionPayload = await authenticateUser(email, password);
  res.json(sessionPayload);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    throw new AppError(400, "Refresh token is required", {
      code: "INVALID_REFRESH_PAYLOAD",
    });
  }

  const sessionPayload = await refreshUserSession(refreshToken);
  res.json(sessionPayload);
});

export const getCurrentUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      throw new AppError(401, "Authentication required", {
        code: "AUTH_REQUIRED",
      });
    }

    const user = await getAuthenticatedUser(req.authUser.userId);
    res.json(user);
  }
);
