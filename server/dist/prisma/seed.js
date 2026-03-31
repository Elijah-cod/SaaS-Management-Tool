"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
            description: "Refresh the customer workspace and improve conversion for trial accounts.",
            startDate: new Date("2026-03-28T00:00:00.000Z"),
            endDate: new Date("2026-04-18T00:00:00.000Z"),
        },
    });
    await prisma.task.createMany({
        data: [
            {
                title: "Implement Zustand store for global drag state",
                description: "Create a shared drag state pattern so cards can move predictably across lanes and survive interaction edge cases.",
                status: "Backlog",
                priority: "High",
                tags: "Feature",
                projectId: project.id,
                authorUserId: amina.userId,
                assignedUserId: amina.userId,
                dueDate: new Date("2026-04-03T00:00:00.000Z"),
            },
            {
                title: "Build optimistic UI wrapper component",
                description: "Wrap optimistic task updates so the UI feels immediate while server synchronization happens in the background.",
                status: "In Progress",
                priority: "High",
                tags: "Feature",
                projectId: project.id,
                authorUserId: amina.userId,
                assignedUserId: daniel.userId,
                dueDate: new Date("2026-04-09T00:00:00.000Z"),
            },
        ],
    });
    const reviewTask = await prisma.task.create({
        data: {
            title: "Audit border-radius consistency across desktop viewports",
            description: "Review visual consistency before handoff so the board feels intentional across desktop and tablet breakpoints.",
            status: "Review",
            priority: "Medium",
            tags: "Design System",
            projectId: project.id,
            authorUserId: daniel.userId,
            assignedUserId: daniel.userId,
            dueDate: new Date("2026-04-07T00:00:00.000Z"),
        },
    });
    const completedTask = await prisma.task.create({
        data: {
            title: "Resolve sync conflict on rapid consecutive drops",
            description: "Prevent duplicate state writes when multiple drag events fire quickly during rapid user interaction.",
            status: "Completed",
            priority: "High",
            tags: "Bugfix",
            projectId: project.id,
            authorUserId: amina.userId,
            assignedUserId: daniel.userId,
            dueDate: new Date("2026-04-05T00:00:00.000Z"),
        },
    });
    await prisma.comment.createMany({
        data: [
            {
                taskId: reviewTask.id,
                text: "Let’s polish the border radius before we freeze the board visuals.",
                userId: daniel.userId,
            },
            {
                taskId: completedTask.id,
                text: "This one is stable now and can live in completed.",
                userId: amina.userId,
            },
        ],
    });
    await prisma.attachment.create({
        data: {
            taskId: reviewTask.id,
            fileName: "radius-audit.fig",
            fileUrl: "uploads/radius-audit.fig",
            uploadedById: daniel.userId,
        },
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
//# sourceMappingURL=seed.js.map