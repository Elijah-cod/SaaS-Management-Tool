"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const prisma_1 = require("../lib/prisma");
const deriveRole = (username) => {
    if (username.includes("Amina")) {
        return "Product Manager";
    }
    if (username.includes("Daniel")) {
        return "Frontend Engineer";
    }
    if (username.includes("Lina")) {
        return "Designer";
    }
    if (username.includes("Musa")) {
        return "Operations Lead";
    }
    return "Team Member";
};
const getUsers = async (_req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            orderBy: {
                userId: "asc",
            },
        });
        const serializedUsers = users.map((user) => ({
            id: `u${user.userId}`,
            name: user.username,
            email: `${user.username.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            role: deriveRole(user.username),
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