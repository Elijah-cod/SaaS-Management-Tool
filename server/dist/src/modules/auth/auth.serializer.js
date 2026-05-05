"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeUser = void 0;
const serializeUser = (user) => ({
    id: `u${user.userId}`,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.profilePictureUrl,
    teamId: user.teamId,
});
exports.serializeUser = serializeUser;
//# sourceMappingURL=auth.serializer.js.map