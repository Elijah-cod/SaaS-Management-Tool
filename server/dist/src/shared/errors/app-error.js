"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppError = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, options = {}) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = options.code;
        this.details = options.details;
        this.expose = options.expose ?? statusCode < 500;
    }
}
exports.AppError = AppError;
const isAppError = (error) => error instanceof AppError;
exports.isAppError = isAppError;
//# sourceMappingURL=app-error.js.map