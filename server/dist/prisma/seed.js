"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const auth_1 = require("../src/lib/auth");
const prisma = new client_1.PrismaClient();
const date = (value) => new Date(`${value}T00:00:00.000Z`);
const legacyTaskTitles = {
    "task:portal:drag-state": [
        "Implement Zustand store for global drag state",
    ],
    "task:portal:optimistic-ui": ["Build optimistic UI wrapper component"],
    "task:portal:interaction-audit": [
        "Audit border-radius consistency across desktop viewports",
    ],
    "task:portal:sync-conflicts": [
        "Resolve sync conflict on rapid consecutive drops",
    ],
};
const requireRecord = (records, key) => {
    const record = records.get(key);
    if (!record) {
        throw new Error(`Missing seeded record: ${key}`);
    }
    return record;
};
const upsertTeam = async (seedKey, data) => {
    const existing = await prisma.team.findFirst({
        where: {
            OR: [{ seedKey }, { teamName: data.teamName }],
        },
    });
    return existing
        ? prisma.team.update({
            where: { id: existing.id },
            data: { ...data, seedKey },
        })
        : prisma.team.create({ data: { ...data, seedKey } });
};
const upsertProject = async (seedKey, data) => {
    const existing = await prisma.project.findFirst({
        where: {
            OR: [{ seedKey }, { name: data.name }],
        },
    });
    return existing
        ? prisma.project.update({
            where: { id: existing.id },
            data: { ...data, seedKey },
        })
        : prisma.project.create({ data: { ...data, seedKey } });
};
const upsertTask = async (seedKey, data) => {
    const existing = await prisma.task.findFirst({
        where: {
            OR: [
                { seedKey },
                { title: data.title, projectId: data.projectId },
                ...(legacyTaskTitles[seedKey] ?? []).map((title) => ({
                    title,
                    projectId: data.projectId,
                })),
            ],
        },
    });
    return existing
        ? prisma.task.update({
            where: { id: existing.id },
            data: { ...data, seedKey },
        })
        : prisma.task.create({ data: { ...data, seedKey } });
};
const upsertComment = async (seedKey, data) => {
    const existing = await prisma.comment.findFirst({
        where: {
            OR: [{ seedKey }, { taskId: data.taskId, text: data.text }],
        },
    });
    return existing
        ? prisma.comment.update({
            where: { id: existing.id },
            data: { ...data, seedKey },
        })
        : prisma.comment.create({ data: { ...data, seedKey } });
};
const upsertAttachment = async (seedKey, data) => {
    const existing = await prisma.attachment.findFirst({
        where: {
            OR: [{ seedKey }, { taskId: data.taskId, fileName: data.fileName }],
        },
    });
    return existing
        ? prisma.attachment.update({
            where: { id: existing.id },
            data: { ...data, seedKey },
        })
        : prisma.attachment.create({ data: { ...data, seedKey } });
};
async function main() {
    const teamSeeds = [
        ["team:growth", "Growth"],
        ["team:platform", "Platform"],
        ["team:product-experience", "Product Experience"],
        ["team:revenue-operations", "Revenue Operations"],
    ];
    const teams = new Map();
    for (const [seedKey, teamName] of teamSeeds) {
        teams.set(seedKey, await upsertTeam(seedKey, {
            teamName,
            productOwnerUserId: null,
            projectManagerUserId: null,
        }));
    }
    const defaultPasswordHash = await (0, auth_1.hashPassword)("ChangeMe123!");
    const userSeeds = [
        {
            email: "amina@saasmanager.app",
            name: "Amina Hassan",
            role: "Product Manager",
            teamKey: "team:growth",
        },
        {
            email: "daniel@saasmanager.app",
            name: "Daniel Kimani",
            role: "Frontend Engineer",
            teamKey: "team:platform",
        },
        {
            email: "lina@saasmanager.app",
            name: "Lina Achieng",
            role: "Product Designer",
            teamKey: "team:product-experience",
        },
        {
            email: "musa@saasmanager.app",
            name: "Musa Otieno",
            role: "Operations Lead",
            teamKey: "team:revenue-operations",
        },
        {
            email: "grace@saasmanager.app",
            name: "Grace Wanjiku",
            role: "Backend Engineer",
            teamKey: "team:platform",
        },
        {
            email: "brian@saasmanager.app",
            name: "Brian Ouma",
            role: "QA Engineer",
            teamKey: "team:product-experience",
        },
        {
            email: "njeri@saasmanager.app",
            name: "Njeri Kamau",
            role: "Growth Analyst",
            teamKey: "team:growth",
        },
        {
            email: "kevin@saasmanager.app",
            name: "Kevin Mwangi",
            role: "Customer Success Lead",
            teamKey: "team:revenue-operations",
        },
    ];
    const users = new Map();
    for (const userSeed of userSeeds) {
        const user = await prisma.user.upsert({
            where: { email: userSeed.email },
            update: {
                name: userSeed.name,
                passwordHash: defaultPasswordHash,
                role: userSeed.role,
                teamId: requireRecord(teams, userSeed.teamKey).id,
            },
            create: {
                email: userSeed.email,
                name: userSeed.name,
                passwordHash: defaultPasswordHash,
                role: userSeed.role,
                teamId: requireRecord(teams, userSeed.teamKey).id,
            },
        });
        users.set(userSeed.email, user);
    }
    const amina = requireRecord(users, "amina@saasmanager.app");
    const musa = requireRecord(users, "musa@saasmanager.app");
    const lina = requireRecord(users, "lina@saasmanager.app");
    const grace = requireRecord(users, "grace@saasmanager.app");
    await Promise.all([
        prisma.team.update({
            where: { id: requireRecord(teams, "team:growth").id },
            data: {
                productOwnerUserId: amina.userId,
                projectManagerUserId: musa.userId,
            },
        }),
        prisma.team.update({
            where: { id: requireRecord(teams, "team:platform").id },
            data: {
                productOwnerUserId: amina.userId,
                projectManagerUserId: grace.userId,
            },
        }),
        prisma.team.update({
            where: { id: requireRecord(teams, "team:product-experience").id },
            data: {
                productOwnerUserId: lina.userId,
                projectManagerUserId: amina.userId,
            },
        }),
        prisma.team.update({
            where: { id: requireRecord(teams, "team:revenue-operations").id },
            data: {
                productOwnerUserId: musa.userId,
                projectManagerUserId: amina.userId,
            },
        }),
    ]);
    const projectSeeds = [
        {
            key: "project:client-portal",
            name: "Client Portal Redesign",
            description: "Refresh the customer workspace and improve conversion for trial accounts.",
            startDate: date("2026-07-06"),
            endDate: date("2026-08-14"),
        },
        {
            key: "project:billing-reliability",
            name: "Billing Reliability Sprint",
            description: "Reduce subscription failures and make payment recovery observable and safe.",
            startDate: date("2026-07-13"),
            endDate: date("2026-08-07"),
        },
        {
            key: "project:self-serve-onboarding",
            name: "Self-Serve Onboarding",
            description: "Help new workspaces reach their first successful delivery milestone faster.",
            startDate: date("2026-07-20"),
            endDate: date("2026-08-28"),
        },
        {
            key: "project:analytics-command-center",
            name: "Analytics Command Center",
            description: "Give delivery leaders a focused view of portfolio health, risk, and throughput.",
            startDate: date("2026-07-27"),
            endDate: date("2026-09-11"),
        },
        {
            key: "project:enterprise-sso",
            name: "Enterprise SSO Rollout",
            description: "Ship secure SAML onboarding and recovery controls for enterprise customers.",
            startDate: date("2026-08-03"),
            endDate: date("2026-09-25"),
        },
    ];
    const projects = new Map();
    for (const projectSeed of projectSeeds) {
        projects.set(projectSeed.key, await upsertProject(projectSeed.key, projectSeed));
    }
    const taskSeeds = [
        ["task:portal:drag-state", "project:client-portal", "Implement shared drag state", "Create a predictable drag state model that survives lane changes and interaction edge cases.", "Backlog", "High", "Feature", "2026-07-14", "2026-07-24", 5, "amina@saasmanager.app", "daniel@saasmanager.app"],
        ["task:portal:optimistic-ui", "project:client-portal", "Build optimistic UI wrapper", "Keep task interactions immediate while server synchronization completes in the background.", "In Progress", "High", "Feature", "2026-07-16", "2026-07-27", 8, "amina@saasmanager.app", "daniel@saasmanager.app"],
        ["task:portal:interaction-audit", "project:client-portal", "Audit responsive interaction consistency", "Review board, search, and task-detail behavior across mobile, tablet, and desktop.", "Review", "Medium", "Design System", "2026-07-18", "2026-07-29", 3, "lina@saasmanager.app", "lina@saasmanager.app"],
        ["task:portal:sync-conflicts", "project:client-portal", "Resolve rapid update sync conflicts", "Prevent duplicate writes when multiple task updates arrive in quick succession.", "Completed", "High", "Bugfix", "2026-07-07", "2026-07-18", 5, "amina@saasmanager.app", "grace@saasmanager.app"],
        ["task:billing:recovery-map", "project:billing-reliability", "Map failed renewal recovery paths", "Document retry, dunning, and customer notification states for failed renewals.", "Backlog", "High", "Discovery", "2026-07-20", "2026-07-28", 3, "musa@saasmanager.app", "kevin@saasmanager.app"],
        ["task:billing:webhooks", "project:billing-reliability", "Add idempotent webhook processing", "Deduplicate provider events and make repeated payment callbacks safe to process.", "In Progress", "High", "Backend", "2026-07-15", "2026-07-25", 8, "grace@saasmanager.app", "grace@saasmanager.app"],
        ["task:billing:load-test", "project:billing-reliability", "Load test invoice generation", "Validate invoice generation throughput and database pressure at peak renewal volume.", "Review", "Medium", "Performance", "2026-07-17", "2026-07-30", 5, "brian@saasmanager.app", "brian@saasmanager.app"],
        ["task:billing:audit-trail", "project:billing-reliability", "Add subscription event audit trail", "Expose an immutable event history for support and finance investigations.", "Completed", "Medium", "Backend", "2026-07-13", "2026-07-20", 5, "grace@saasmanager.app", "grace@saasmanager.app"],
        ["task:onboarding:checklist", "project:self-serve-onboarding", "Draft activation checklist", "Define the smallest set of actions that signals a workspace has reached first value.", "Backlog", "Medium", "Product", "2026-07-22", "2026-07-31", 3, "amina@saasmanager.app", "njeri@saasmanager.app"],
        ["task:onboarding:first-value", "project:self-serve-onboarding", "Instrument the first-value event", "Capture the moment a team creates, assigns, and advances its first real task.", "In Progress", "High", "Analytics", "2026-07-20", "2026-08-03", 5, "njeri@saasmanager.app", "njeri@saasmanager.app"],
        ["task:onboarding:invites", "project:self-serve-onboarding", "Review workspace invite flow", "Remove ambiguity from invitations, expired links, and first-time member access.", "Review", "Medium", "UX", "2026-07-21", "2026-08-05", 3, "lina@saasmanager.app", "brian@saasmanager.app"],
        ["task:onboarding:empty-states", "project:self-serve-onboarding", "Ship guided setup empty states", "Turn empty workspace screens into focused prompts that lead teams to useful actions.", "Completed", "Medium", "Frontend", "2026-07-08", "2026-07-19", 5, "lina@saasmanager.app", "daniel@saasmanager.app"],
        ["task:analytics:health-metrics", "project:analytics-command-center", "Define delivery health metrics", "Agree on stable definitions for throughput, blocked work, risk, and cycle time.", "Backlog", "High", "Analytics", "2026-07-27", "2026-08-05", 3, "amina@saasmanager.app", "njeri@saasmanager.app"],
        ["task:analytics:risk-endpoint", "project:analytics-command-center", "Build portfolio risk endpoint", "Aggregate overdue and high-priority work into a permission-aware portfolio response.", "In Progress", "High", "Backend", "2026-07-28", "2026-08-12", 8, "grace@saasmanager.app", "grace@saasmanager.app"],
        ["task:analytics:date-filters", "project:analytics-command-center", "Validate date range filters", "Cover timezone, open-ended range, and invalid date cases across analytics views.", "Review", "Medium", "QA", "2026-07-30", "2026-08-14", 5, "brian@saasmanager.app", "brian@saasmanager.app"],
        ["task:analytics:timeline-index", "project:analytics-command-center", "Index task timeline queries", "Reduce latency for project and workspace timeline reads at realistic data volume.", "Completed", "High", "Performance", "2026-07-14", "2026-07-24", 5, "grace@saasmanager.app", "grace@saasmanager.app"],
        ["task:sso:metadata", "project:enterprise-sso", "Confirm SAML metadata contract", "Finalize required identity provider fields and validation feedback for administrators.", "Backlog", "High", "Security", "2026-08-03", "2026-08-12", 3, "musa@saasmanager.app", "kevin@saasmanager.app"],
        ["task:sso:domain-mapping", "project:enterprise-sso", "Implement organization domain mapping", "Resolve verified domains to the correct enterprise authentication configuration.", "In Progress", "High", "Backend", "2026-08-05", "2026-08-19", 8, "grace@saasmanager.app", "grace@saasmanager.app"],
        ["task:sso:acs-review", "project:enterprise-sso", "Security review ACS validation", "Test assertion consumer validation, replay protection, and unsafe redirect handling.", "Review", "High", "Security", "2026-08-10", "2026-08-24", 5, "brian@saasmanager.app", "brian@saasmanager.app"],
        ["task:sso:recovery-docs", "project:enterprise-sso", "Document SSO recovery procedure", "Give support a safe recovery path when customer identity configuration is unavailable.", "Completed", "Medium", "Documentation", "2026-08-03", "2026-08-14", 3, "kevin@saasmanager.app", "kevin@saasmanager.app"],
    ];
    const tasks = new Map();
    for (const taskSeed of taskSeeds) {
        const [seedKey, projectKey, title, description, status, priority, tags, startDate, dueDate, points, authorEmail, assigneeEmail,] = taskSeed;
        const task = await upsertTask(seedKey, {
            title,
            description,
            status,
            priority,
            tags,
            startDate: date(startDate),
            dueDate: date(dueDate),
            points,
            projectId: requireRecord(projects, projectKey).id,
            authorUserId: requireRecord(users, authorEmail).userId,
            assignedUserId: requireRecord(users, assigneeEmail).userId,
        });
        tasks.set(seedKey, task);
    }
    const commentSeeds = [
        ["comment:portal:optimistic-ui:api", "task:portal:optimistic-ui", "The API contract is stable. Please keep rollback behavior visible in the UI.", "grace@saasmanager.app"],
        ["comment:portal:interaction-audit:mobile", "task:portal:interaction-audit", "Mobile search and task details now pass the interaction review.", "lina@saasmanager.app"],
        ["comment:billing:webhooks:fixtures", "task:billing:webhooks", "Added replay fixtures for duplicate and out-of-order provider events.", "brian@saasmanager.app"],
        ["comment:billing:load-test:baseline", "task:billing:load-test", "Baseline is captured at 500 invoices per minute with no failed writes.", "brian@saasmanager.app"],
        ["comment:onboarding:first-value:event", "task:onboarding:first-value", "The event now includes workspace age and invited-member count.", "njeri@saasmanager.app"],
        ["comment:analytics:risk-endpoint:permissions", "task:analytics:risk-endpoint", "Keep team membership checks in the service layer before aggregation.", "amina@saasmanager.app"],
        ["comment:sso:acs-review:replay", "task:sso:acs-review", "Replay protection is mandatory before this moves to completed.", "musa@saasmanager.app"],
        ["comment:sso:recovery-docs:support", "task:sso:recovery-docs", "Support reviewed the recovery checklist and escalation contacts.", "kevin@saasmanager.app"],
    ];
    for (const [seedKey, taskKey, text, userEmail] of commentSeeds) {
        await upsertComment(seedKey, {
            taskId: requireRecord(tasks, taskKey).id,
            text,
            userId: requireRecord(users, userEmail).userId,
        });
    }
    const attachmentSeeds = [
        ["attachment:portal:interaction-audit", "task:portal:interaction-audit", "responsive-audit.fig", "uploads/responsive-audit.fig", "lina@saasmanager.app"],
        ["attachment:billing:load-test", "task:billing:load-test", "invoice-load-test.csv", "uploads/invoice-load-test.csv", "brian@saasmanager.app"],
        ["attachment:onboarding:invites", "task:onboarding:invites", "invite-flow-map.fig", "uploads/invite-flow-map.fig", "lina@saasmanager.app"],
        ["attachment:analytics:health-metrics", "task:analytics:health-metrics", "metric-definitions.md", "uploads/metric-definitions.md", "njeri@saasmanager.app"],
        ["attachment:sso:acs-review", "task:sso:acs-review", "saml-security-checklist.pdf", "uploads/saml-security-checklist.pdf", "brian@saasmanager.app"],
    ];
    for (const [seedKey, taskKey, fileName, fileUrl, userEmail] of attachmentSeeds) {
        await upsertAttachment(seedKey, {
            taskId: requireRecord(tasks, taskKey).id,
            fileName,
            fileUrl,
            uploadedById: requireRecord(users, userEmail).userId,
        });
    }
    console.info(`Seeded ${teams.size} teams, ${users.size} users, ${projects.size} projects, and ${tasks.size} tasks without deleting workspace data.`);
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