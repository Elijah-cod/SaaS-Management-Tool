"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = exports.refreshUserSession = exports.authenticateUser = void 0;
const prisma_1 = require("../../shared/database/prisma");
const app_error_1 = require("../../shared/errors/app-error");
const password_1 = require("../../shared/auth/password");
const token_1 = require("../../shared/auth/token");
const auth_serializer_1 = require("./auth.serializer");
const authenticateUser = async (email, password) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
        },
    });
    if (!user) {
        throw new app_error_1.AppError(401, "Invalid email or password", {
            code: "INVALID_CREDENTIALS",
        });
    }
    const isValidPassword = await (0, password_1.verifyPassword)(password, user.passwordHash);
    if (!isValidPassword) {
        throw new app_error_1.AppError(401, "Invalid email or password", {
            code: "INVALID_CREDENTIALS",
        });
    }
    return {
        accessToken: (0, token_1.createAccessToken)(user),
        accessTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 8,
        refreshToken: (0, token_1.createRefreshToken)(user),
        user: (0, auth_serializer_1.serializeUser)(user),
    };
};
exports.authenticateUser = authenticateUser;
const refreshUserSession = async (refreshToken) => {
    const tokenPayload = (0, token_1.verifyRefreshToken)(refreshToken);
    if (!tokenPayload) {
        throw new app_error_1.AppError(401, "Refresh token is invalid or expired", {
            code: "INVALID_REFRESH_TOKEN",
        });
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            userId: Number(tokenPayload.sub),
        },
    });
    if (!user) {
        throw new app_error_1.AppError(401, "Refresh token is invalid or expired", {
            code: "INVALID_REFRESH_TOKEN",
        });
    }
    return {
        accessToken: (0, token_1.createAccessToken)(user),
        accessTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 8,
        refreshToken: (0, token_1.createRefreshToken)(user),
        user: (0, auth_serializer_1.serializeUser)(user),
    };
};
exports.refreshUserSession = refreshUserSession;
const getAuthenticatedUser = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            userId,
        },
    });
    if (!user) {
        throw new app_error_1.AppError(404, "User not found", {
            code: "USER_NOT_FOUND",
        });
    }
    return (0, auth_serializer_1.serializeUser)(user);
};
exports.getAuthenticatedUser = getAuthenticatedUser;
//# sourceMappingURL=auth.service.js.map