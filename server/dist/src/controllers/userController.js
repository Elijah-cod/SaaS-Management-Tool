"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const prisma_1 = require("../lib/prisma");
const getUsers = async (_req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            orderBy: {
                userId: "asc",
            },
        });
        const serializedUsers = users.map((user) => ({
            id: `u${user.userId}`,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.profilePictureUrl,
            teamId: user.teamId,
        }));
        res.json(serializedUsers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};
exports.getUsers = getUsers;
//# sourceMappingURL=userController.js.map