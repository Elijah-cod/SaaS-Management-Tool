import { prisma } from "../../shared/database/prisma";

const normalizeQuery = (query: string) => query.trim().slice(0, 120);

export const searchWorkspaceResources = async (rawQuery: string) => {
  const query = normalizeQuery(rawQuery);

  if (!query) {
    return {
      projects: [],
      tasks: [],
      users: [],
      teams: [],
    };
  }

  const [projects, tasks, users, teams] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    prisma.team.findMany({
      where: {
        teamName: { contains: query, mode: "insensitive" },
      },
      take: 10,
    }),
  ]);

  return { projects, tasks, users, teams };
};
