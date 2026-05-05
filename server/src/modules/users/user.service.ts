import { prisma } from "../../shared/database/prisma";

export const listUsers = async () => {
  const users = await prisma.user.findMany({
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
