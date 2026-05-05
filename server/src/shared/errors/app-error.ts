export type AppErrorOptions = {
  code?: string;
  details?: unknown;
  expose?: boolean;
};

export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;
  expose: boolean;

  constructor(statusCode: number, message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = options.code;
    this.details = options.details;
    this.expose = options.expose ?? statusCode < 500;
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;
