"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = void 0;
const prisma_1 = require("../../shared/database/prisma");
const listUsers = async () => {
    const users = await prisma_1.prisma.user.findMany({
        orderBy: {
            userId: "asc",
        },
    });
    return users.map((user) => ({
        id: `u${user.userId}`,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.profilePictureUrl,
        teamId: user.teamId,
    }));
};
exports.listUsers = listUsers;
//# sourceMappingURL=user.service.js.map