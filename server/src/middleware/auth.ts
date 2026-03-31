import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth";

export type AuthenticatedRequest = Request & {
  authUser?: {
    userId: number;
    email: string;
    role: string;
  };
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authorization.slice("Bearer ".length);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.authUser = {
    userId: Number(payload.sub),
    email: payload.email,
    role: payload.role,
  };

  return next();
};

export const requireRole =
  (...roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.authUser.role)) {
      return res.status(403).json({ message: "You do not have access to this action" });
    }

    return next();
  };
