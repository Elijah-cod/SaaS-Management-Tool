"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const app_1 = require("../app");
const auth_1 = require("../lib/auth");
const prisma_1 = require("../lib/prisma");
const originalUserFindUnique = prisma_1.prisma.user.findUnique.bind(prisma_1.prisma.user);
const originalProjectFindMany = prisma_1.prisma.project.findMany.bind(prisma_1.prisma.project);
const originalCommentCreate = prisma_1.prisma.comment.create.bind(prisma_1.prisma.comment);
const originalTaskFindUnique = prisma_1.prisma.task.findUnique.bind(prisma_1.prisma.task);
const prismaUser = prisma_1.prisma.user;
const prismaProject = prisma_1.prisma.project;
const prismaComment = prisma_1.prisma.comment;
const prismaTask = prisma_1.prisma.task;
let activeServer = null;
const startServer = async () => {
    const app = (0, app_1.createApp)();
    const server = app.listen(0, "127.0.0.1");
    activeServer = server;
    await new Promise((resolve) => {
        server.on("listening", () => resolve());
    });
    const address = server.address();
    return `http://127.0.0.1:${address.port}`;
};
(0, node_test_1.afterEach)(async () => {
    prismaUser.findUnique = originalUserFindUnique;
    prismaProject.findMany = originalProjectFindMany;
    prismaComment.create = originalCommentCreate;
    prismaTask.findUnique = originalTaskFindUnique;
    if (activeServer) {
        await new Promise((resolve, reject) => {
            activeServer?.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
        activeServer = null;
    }
});
(0, node_test_1.test)("POST /auth/login returns an access token for valid persisted credentials", { concurrency: false }, async () => {
    const passwordHash = await (0, auth_1.hashPassword)("ChangeMe123!");
    const fakeUser = {
        userId: 7,
        email: "amina@saasmanager.app",
        name: "Amina Hassan",
        passwordHash,
        role: "Product Manager",
        profilePictureUrl: null,
        teamId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    prismaUser.findUnique = (async () => fakeUser);
    const baseUrl = await startServer();
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            email: "amina@saasmanager.app",
            password: "ChangeMe123!",
        }),
    });
    strict_1.default.equal(response.status, 200);
    const payload = (await response.json());
    strict_1.default.ok(payload.accessToken);
    strict_1.default.ok(payload.accessTokenExpiresAt > Date.now());
    strict_1.default.ok(payload.refreshToken);
    strict_1.default.equal(payload.user.email, "amina@saasmanager.app");
    strict_1.default.equal(payload.user.role, "Product Manager");
});
(0, node_test_1.test)("POST /auth/refresh rotates a refresh token into a fresh session", { concurrency: false }, async () => {
    const fakeUser = {
        userId: 7,
        email: "amina@saasmanager.app",
        name: "Amina Hassan",
        passwordHash: "unused",
        role: "Product Manager",
        profilePictureUrl: null,
        teamId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    prismaUser.findUnique = (async () => fakeUser);
    const baseUrl = await startServer();
    const refreshToken = (0, auth_1.createRefreshToken)(fakeUser);
    const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
    });
    strict_1.default.equal(response.status, 200);
    const payload = (await response.json());
    strict_1.default.ok(payload.accessToken);
    strict_1.default.ok(payload.accessTokenExpiresAt > Date.now());
    strict_1.default.ok(payload.refreshToken);
    strict_1.default.equal(payload.user.email, fakeUser.email);
});
(0, node_test_1.test)("POST /auth/refresh rejects an access token", { concurrency: false }, async () => {
    const baseUrl = await startServer();
    const accessToken = (0, auth_1.createAccessToken)({
        userId: 7,
        email: "amina@saasmanager.app",
        role: "Product Manager",
    });
    const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ refreshToken: accessToken }),
    });
    strict_1.default.equal(response.status, 401);
});
(0, node_test_1.test)("GET /projects rejects a refresh token", { concurrency: false }, async () => {
    const baseUrl = await startServer();
    const refreshToken = (0, auth_1.createRefreshToken)({
        userId: 7,
        email: "amina@saasmanager.app",
        role: "Product Manager",
    });
    const response = await fetch(`${baseUrl}/projects`, {
        headers: {
            authorization: `Bearer ${refreshToken}`,
        },
    });
    strict_1.default.equal(response.status, 401);
});
(0, node_test_1.test)("POST /auth/login rejects an invalid request body", { concurrency: false }, async () => {
    const baseUrl = await startServer();
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            email: "not-an-email",
        }),
    });
    strict_1.default.equal(response.status, 400);
    const payload = (await response.json());
    strict_1.default.ok(payload.errors.includes("Email must be valid"));
    strict_1.default.ok(payload.errors.includes("Password is required"));
});
(0, node_test_1.test)("GET /projects requires authentication", { concurrency: false }, async () => {
    const baseUrl = await startServer();
    const response = await fetch(`${baseUrl}/projects`);
    strict_1.default.equal(response.status, 401);
});
(0, node_test_1.test)("POST /projects rejects users without the required role", { concurrency: false }, async () => {
    const baseUrl = await startServer();
    const token = (0, auth_1.createAccessToken)({
        userId: 3,
        email: "viewer@saasmanager.app",
        role: "Team Member",
    });
    const response = await fetch(`${baseUrl}/projects`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            name: "Unauthorized Project",
        }),
    });
    strict_1.default.equal(response.status, 403);
});
(0, node_test_1.test)("PATCH /tasks/:taskId/status validates allowed lane values", { concurrency: false }, async () => {
    const baseUrl = await startServer();
    const token = (0, auth_1.createAccessToken)({
        userId: 7,
        email: "amina@saasmanager.app",
        role: "Product Manager",
    });
    const response = await fetch(`${baseUrl}/tasks/101/status`, {
        method: "PATCH",
        headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            status: "Done",
        }),
    });
    strict_1.default.equal(response.status, 400);
    const payload = (await response.json());
    strict_1.default.ok(payload.errors.includes("Task status must be Backlog, In Progress, Review, or Completed"));
});
(0, node_test_1.test)("POST /tasks/:taskId/comments uses the authenticated user instead of a spoofed author id", { concurrency: false }, async () => {
    let createdCommentUserId = 0;
    prismaComment.create = (async ({ data, }) => {
        createdCommentUserId = data.userId;
        return {
            id: 1,
            text: data.text,
            taskId: data.taskId,
            userId: data.userId,
        };
    });
    prismaTask.findUnique = (async () => ({
        id: 101,
        title: "Test task",
        description: null,
        status: "Backlog",
        priority: "High",
        tags: "Feature",
        startDate: null,
        dueDate: null,
        points: null,
        projectId: 1,
        authorUserId: 7,
        assignedUserId: 7,
        author: {
            userId: 7,
            email: "amina@saasmanager.app",
            name: "Amina Hassan",
            passwordHash: "hash",
            role: "Product Manager",
            profilePictureUrl: null,
            teamId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        assignee: {
            userId: 7,
            email: "amina@saasmanager.app",
            name: "Amina Hassan",
            passwordHash: "hash",
            role: "Product Manager",
            profilePictureUrl: null,
            teamId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        attachments: [],
        comments: [],
    }));
    const baseUrl = await startServer();
    const token = (0, auth_1.createAccessToken)({
        userId: 7,
        email: "amina@saasmanager.app",
        role: "Product Manager",
    });
    const response = await fetch(`${baseUrl}/tasks/101/comments`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            authorId: "u999",
            body: "Ship it",
        }),
    });
    strict_1.default.equal(response.status, 201);
    strict_1.default.equal(createdCommentUserId, 7);
});
//# sourceMappingURL=auth.integration.test.js.map