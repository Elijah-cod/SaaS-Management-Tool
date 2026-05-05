import type { ErrorRequestHandler } from "express";
import { env } from "../../config/env";
import { AppError, isAppError } from "../errors/app-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = isAppError(error)
    ? error
    : new AppError(500, "Unexpected server error", {
        code: "INTERNAL_SERVER_ERROR",
        expose: false,
      });

  if (!isAppError(error) || appError.statusCode >= 500) {
    console.error(error);
  }

  const responseBody: Record<string, unknown> = {
    message: appError.message,
  };

  if (appError.code) {
    responseBody.code = appError.code;
  }

  if (appError.expose && appError.details !== undefined) {
    responseBody.details = appError.details;
  }

  if (!isAppError(error) && env.nodeEnv !== "production" && error instanceof Error) {
    responseBody.debug = error.message;
  }

  res.status(appError.statusCode).json(responseBody);
};
