"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.refresh = exports.login = void 0;
const async_handler_1 = require("../../shared/http/async-handler");
const app_error_1 = require("../../shared/errors/app-error");
const auth_service_1 = require("./auth.service");
exports.login = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new app_error_1.AppError(400, "Email and password are required", {
            code: "INVALID_LOGIN_PAYLOAD",
        });
    }
    const sessionPayload = await (0, auth_service_1.authenticateUser)(email, password);
    res.json(sessionPayload);
});
exports.refresh = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new app_error_1.AppError(400, "Refresh token is required", {
            code: "INVALID_REFRESH_PAYLOAD",
        });
    }
    const sessionPayload = await (0, auth_service_1.refreshUserSession)(refreshToken);
    res.json(sessionPayload);
});
exports.getCurrentUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.authUser) {
        throw new app_error_1.AppError(401, "Authentication required", {
            code: "AUTH_REQUIRED",
        });
    }
    const user = await (0, auth_service_1.getAuthenticatedUser)(req.authUser.userId);
    res.json(user);
});
//# sourceMappingURL=auth.controller.js.map