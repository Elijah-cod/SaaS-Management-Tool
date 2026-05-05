"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const auth_1 = require("../lib/auth");
const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication required" });
    }
    const token = authorization.slice("Bearer ".length);
    const payload = (0, auth_1.verifyAccessToken)(token);
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
exports.requireAuth = requireAuth;
const requireRole = (...roles) => (req, res, next) => {
    if (!req.authUser) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.authUser.role)) {
        return res.status(403).json({ message: "You do not have access to this action" });
    }
    return next();
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map