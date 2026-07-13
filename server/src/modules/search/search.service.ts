import { prisma } from "../../shared/database/prisma";
import { serializeProject } from "../projects/project.serializer";
import { serializeTask, taskDetailInclude } from "../tasks/task.serializer";

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

  const [projects, tasks, users, teams, workspaceUsers] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      include: { tasks: true },
    }),
    prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      include: taskDetailInclude,
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
    prisma.user.findMany({
      select: { teamId: true },
    }),
  ]);

  return {
    projects: projects.map(serializeProject),
    tasks: tasks.map(serializeTask),
    users: users.map((user) => ({
      id: `u${user.userId}`,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.profilePictureUrl,
      teamId: user.teamId,
    })),
    teams: teams.map((team) => ({
      id: team.id,
      name: team.teamName,
      description: "Cross-functional delivery team",
      memberCount: workspaceUsers.filter((user) => user.teamId === team.id).length,
      productOwnerUserId: team.productOwnerUserId,
      projectManagerUserId: team.projectManagerUserId,
    })),
  };
};
