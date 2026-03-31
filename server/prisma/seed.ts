import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.project.deleteMany();

  const growthTeam = await prisma.team.create({
    data: {
      teamName: "Growth",
    },
  });

  const platformTeam = await prisma.team.create({
    data: {
      teamName: "Platform",
    },
  });

  const amina = await prisma.user.create({
    data: {
      cognitoId: "local-amina",
      username: "Amina Hassan",
      teamId: growthTeam.id,
    },
  });

  const daniel = await prisma.user.create({
    data: {
      cognitoId: "local-daniel",
      username: "Daniel Kimani",
      teamId: platformTeam.id,
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Client Portal Redesign",
      description:
        "Refresh the customer workspace and improve conversion for trial accounts.",
      startDate: new Date("2026-03-28T00:00:00.000Z"),
      endDate: new Date("2026-04-18T00:00:00.000Z"),
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Finalize page hierarchy",
        description: "Review navigation structure and information architecture.",
        status: "Done",
        priority: "High",
        projectId: project.id,
        authorUserId: amina.userId,
        assignedUserId: daniel.userId,
        dueDate: new Date("2026-04-03T00:00:00.000Z"),
      },
      {
        title: "Implement onboarding widgets",
        description: "Build usage cards and trial conversion prompts.",
        status: "In Progress",
        priority: "High",
        projectId: project.id,
        authorUserId: amina.userId,
        assignedUserId: daniel.userId,
        dueDate: new Date("2026-04-09T00:00:00.000Z"),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
