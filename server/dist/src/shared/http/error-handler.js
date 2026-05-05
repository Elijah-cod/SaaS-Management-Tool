"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_1 = require("../../config/env");
const app_error_1 = require("../errors/app-error");
const errorHandler = (error, _req, res, _next) => {
    const appError = (0, app_error_1.isAppError)(error)
        ? error
        : new app_error_1.AppError(500, "Unexpected server error", {
            code: "INTERNAL_SERVER_ERROR",
            expose: false,
        });
    if (!(0, app_error_1.isAppError)(error) || appError.statusCode >= 500) {
        console.error(error);
    }
    const responseBody = {
        message: appError.message,
    };
    if (appError.code) {
        responseBody.code = appError.code;
    }
    if (appError.expose && appError.details !== undefined) {
        responseBody.details = appError.details;
    }
    if (!(0, app_error_1.isAppError)(error) && env_1.env.nodeEnv !== "production" && error instanceof Error) {
        responseBody.debug = error.message;
    }
    res.status(appError.statusCode).json(responseBody);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map