import { prisma } from "../../shared/database/prisma";

export const listTeams = async () => {
  const [teams, users] = await Promise.all([
    prisma.team.findMany({
      orderBy: {
        id: "asc",
      },
    }),
    prisma.user.findMany(),
  ]);

  return teams.map((team) => ({
    id: team.id,
    name: team.teamName,
    description: "Cross-functional delivery team",
    memberCount: users.filter((user) => user.teamId === team.id).length,
    productOwnerUserId: team.productOwnerUserId,
    projectManagerUserId: team.projectManagerUserId,
  }));
};
